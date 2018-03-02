/* jshint eqnull:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:true, undef:true, curly:false, node:true, devel:true, newcap:false, maxerr:50 */
(function () {
	"use strict";

	// Imports
	var fs = require("fs"),
		url = require("url"),
		path = require("path"),
		child_process = require("child_process");

	var html_minifier, CleanCSS, debug_wrap;

	try {
		html_minifier = require("html-minifier");
		CleanCSS = require("clean-css");
		debug_wrap = require("./x-build-src/debug_wrap");
	}
	catch (e) {
		process.stderr.write("Dependencies not installed\n");
		console.log(e);
		process.exit(-1);
		return -1;
	}


	var script_dir = path.dirname(require.main.filename),
		is_windows = /^win/i.test(process.platform);


	var media_types = {
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".css": "text/css",
		".svg": "image/svg+xml",
		"": "text/plain"
	};


	var json_normalize = function (root, json, cd, files) {
		if (json !== null && typeof(json) === "object") {
			var other, k, v;
			for (k in json) {
				v = json[k];
				if (typeof(v) === "string") {
					if (v.length >= 2 && v[0] === "@") {
						if (v[1] === ":") {
							v = split_fragment(v.substr(2));
							if (v[0].length === 0) {
								other = root;
							}
							else {
								other = json_read(path.resolve(cd, v[0]), files);
							}
							json[k] = json_select(other, v[1]);
						}
						else if (v[1] === "@") {
							json[k] = v.substr(1);
						}
					}
				}
				else if (v !== null && typeof(v) === "object") {
					v = json_normalize(root, v, cd, files);
				}
			}
		}
		return json;
	};
	var json_read = function (file, files) {
		var input = fs.readFileSync(file, "utf8"),
			json = JSON.parse(input);

		if (files === undefined) files = [];

		files.push(file);

		return json_normalize(json, json, path.dirname(file), files);
	};
	var json_select = function (json, selector) {
		if (selector) {
			selector = selector.split(".");
			for (var i = 0; i < selector.length; ++i) {
				if (json === null || typeof(json) !== "object") {
					json = undefined;
					break;
				}
				json = json[selector[i]];
			}
		}

		return json;
	};


	var DependencyGraph = (function () {

		var Node = function (file_name, depth, index) {
			this.file = file_name;
			this.source = null;
			this.max_depth = depth;
			this.index = index;
			this.children = [];
		};

		var DependencyGraph = function () {
			this.children = [];
			this.nodes = [];
			this.new_nodes = [];
			this.stack = [];
			this.stack.push(this);
		};

		DependencyGraph.prototype.push = function (file_name) {
			var top = this.stack[this.stack.length - 1],
				depth = this.stack.length,
				n, i, ii;

			for (i = 0, ii = this.nodes.length; i < ii; ++i) {
				n = this.nodes[i];
				if (n.file === file_name) {
					// Already exists
					n.max_depth = Math.max(n.max_depth, depth);
					return null;
				}
			}

			n = new Node(file_name, depth, this.nodes.length);
			this.nodes.push(n);
			this.new_nodes.push(n);
			top.children.push(n);
			this.stack.push(n);
			return n;
		};
		DependencyGraph.prototype.pop = function () {
			this.stack.pop();
		};
		DependencyGraph.prototype.is_start = function () {
			return (this.stack.length <= 1);
		};
		DependencyGraph.prototype.stringify = function (tabstr) {
			var tab_start = 1,
				full_src = "",
				i, ii, src, nl;

			this.new_nodes.sort(sort_function);

			for (i = 0, ii = this.new_nodes.length; i < ii; ++i) {
				if (i > 0) {
					full_src += nl;
				}

				src = this.new_nodes[i].source;
				nl = get_newline.call(this, src);
				src = src.trim();
				if (tabstr.length > 0) {
					src = indent(src, tabstr, tab_start);
					tab_start = 0;
				}

				full_src += src;
			}
			this.new_nodes = [];

			// Done
			return full_src;
		};

		var sort_function = function (n1, n2) {
			if (n1.max_depth > n2.max_depth) return -1;
			return (n1.index > n2.index) ? -1 : 1;
		};
		var indent = function (src, tabstr, i) {
			var ii, line;
			src = src.split("\n");
			for (ii = src.length; i < ii; ++i) {
				line = src[i];
				if (line.length > 0 && line !== "\r") {
					src[i] = tabstr + line;
				}
			}
			return src.join("\n");
		};
		var get_newline = function (src) {
			var p = src.indexOf("\n");
			if (p < 0) return "\n"; // Default
			return (p > 0 && src[p - 1] === "\r" ? "\r\n" : "\n");
		};

		return DependencyGraph;

	})();

	var get_tabbing = function (text, position) {
		var tabbing = "",
			c;
		while (--position >= 0) {
			c = text[position];
			switch (c) {
				case ' ':
				case '\t':
					tabbing += c;
					break;
				case '\r':
				case '\n':
					position = 0;
					break;
				default:
					tabbing = "";
			}
		}
		return tabbing;
	};
	var to_args = function (text) {
		var args = {},
			m, i;
		if (text !== null) {
			text = text.split("&");
			for (i = 0; i < text.length; ++i) {
				if (text[i].length > 0) {
					m = text[i].split("=");
					args[m[0]] = (m.length > 1) ? m.slice(1).join("=") : null;
				}
			}
		}
		return args;
	};
	var split_fragment = function (text) {
		var p = text.indexOf("#");
		return (p >= 0) ? [ text.substr(0, p), text.substr(p + 1) ] : [ text, null ];
	};
	var preprocessors = {
		version: function (content, settings) {
			if (settings.comment) {
				settings.comment = false;
			}
			if (content !== undefined) {
				return settings.data.version.split(".").join(content);
			}
			return settings.data.version;
		},
		style: function (content, settings) {
			var file = path.normalize(path.resolve(settings.file, content || "")),
				src = get_source(file, settings.data);
			src = new CleanCSS({ roundingPrecision: -1 }).minify(src).styles;

			if (settings.quote !== null) {
				settings.quote = null;
				src = JSON.stringify(src);
			}

			settings.data.files.push(file);

			return src;
		},
		styles: function (content, settings) {
			var files = content.split(","),
				src = "",
				file, i, ii;

			for (i = 0, ii = files.length; i < ii; ++i) {
				file = path.normalize(path.resolve(settings.file, files[i]));
				settings.data.files.push(file);
				src += get_source(file, settings.data);
			}

			src = new CleanCSS({ roundingPrecision: -1 }).minify(src).styles;

			if (settings.quote !== null) {
				settings.quote = null;
				src = JSON.stringify(src);
			}

			return src;
		},
		data: function (content, settings) {
			var file = path.normalize(path.resolve(settings.file, content || "")),
				src = fs.readFileSync(file).toString("base64"),
				ext = path.extname(file).toLowerCase(),
				type = media_types[(Object.prototype.hasOwnProperty.call(media_types, ext)) ? ext : ""];

			settings.data.files.push(file);

			return "data:" + type + ";base64," + src;
		},
		html: function (content, settings) {
			var file = path.normalize(path.resolve(settings.file, content || "")),
				src = get_source(file, settings.data);

			src = html_minifier.minify(src, { removeComments: true, collapseWhitespace: true });

			if (settings.quote !== null) {
				src = src.replace(new RegExp(settings.quote, "g"), "\\" + settings.quote);
			}

			settings.data.files.push(file);

			return src;
		},
		json: function (content, settings) {
			var file = split_fragment(content || ""),
				json, selector;

			if (file[0].length === 0) {
				json = settings.data.json;
				selector = file[1] || "";
			}
			else {
				file[0] = path.normalize(path.resolve(settings.file, file[0]));
				json = json_read(file[0], settings.data.files);
				selector = file[1] || "";
			}

			return "" + json_select(json, selector);
		},
		require: function (content, settings, info) {
			var dependencies = settings.data.dependencies,
				file = split_fragment(path.normalize(path.resolve(settings.file, content || ""))),
				args = to_args(file[1]),
				tabchar = "\t",
				tabstr = info.tabbing,
				i, v, n;

			settings.comment = false;

			n = dependencies.push(file[0]);
			if (n !== null) {
				n.source = get_source(file[0], settings.data);
				settings.data.files.push(file[0]);
				dependencies.pop();
			}

			// Dependencies
			if (!dependencies.is_start()) return "";

			if ((v = args.tabs) !== undefined && !isNaN((v = parseInt(v, 10)))) {
				tabstr = "";
				for (i = 0; i < v; ++i) {
					tabstr += tabchar;
				}
			}

			return dependencies.stringify(tabstr);
		}
	};
	var get_source = function (file, data) {
		var re_preprocess = /('|"|\/\*|)\#\{(\w+)(?::(.*))?\}\#('|"|\*\/|)/ig,
			settings = { quote: null, comment: false, data: data, file: null },
			source;

		file = path.normalize(path.resolve(file));
		settings.file = path.dirname(file);

		source = fs.readFileSync(file, "utf8");
		source = remove_special_comments(source);
		source = source.replace(re_preprocess, function (m, opener, type, content, closer, offset, source) {
			var any = false,
				info = { tabbing: "" };

			if (opener.length > 0 && closer.length > 0) {
				if (opener === closer) {
					settings.quote = opener;
					any = true;
				}
				else if (opener === "/*" && closer === "*/") {
					settings.comment = true;
					any = true;
					info.tabbing = get_tabbing(source, offset);
				}
			}

			if (Object.prototype.hasOwnProperty.call(preprocessors, type)) {
				m = preprocessors[type].call(null, content, settings, info);
				if (settings.comment) {
					opener = "/*";
					closer = "*/";
				}
				else if (settings.quote) {
					opener = closer = settings.quote;
				}
				else if (any) {
					opener = closer = "";
				}

				m = opener + m + closer;
			}

			settings.quote = null;
			settings.comment = false;

			return m;
		});

		return source;
	};
	var remove_special_comments = function (source) {
		return source.replace(/([\r\n]\s*)?\/\*\s*(jshint|globals)\s+.*\*\/(?:\r?\n)?/g, "");
	};


	var uniquify = function (array) {
		var obj = {},
			array_new = [],
			v, i, ii;

		for (i = 0, ii = array.length; i < ii; ++i) {
			v = array[i];
			if (!Object.prototype.hasOwnProperty.call(obj, v)) {
				obj[v] = true;
				array_new.push(v);
			}
		}

		return array_new;
	};


	var try_wrapper = function (fn) {
		var args = Array.prototype.slice.call(arguments, 1);

		try {
			return fn.apply(null, args);
		}
		catch (e) {
			var pad = "========================================\n";
			process.stderr.write(pad + "" + (e.stack || e) + "\n" + pad);
		}
	};


	// Building
	var build = function (json, json_file_dir, fn_tag, tag, no_update, debug) {
		var requirements, input_files, output_file, output_meta, header, source, version, list, f, i, ii;

		// Read
		version = json.version + (debug ? ".-0xDB" : "");

		input_files = json.inputs;
		output_file = json.output;
		if (fn_tag) output_file = output_file.replace(/\.user\.js$/, fn_tag + ".user.js");
		output_meta = output_file.replace(/\.user\.js$/, ".meta.js");
		output_file = path.normalize(path.resolve(json_file_dir, output_file));
		output_meta = path.normalize(path.resolve(json_file_dir, output_meta));

		for (i = 0, ii = input_files.length; i < ii; ++i) {
			input_files[i] = path.resolve(json_file_dir, input_files[i]);
		}

		requirements = input_files.slice(0);


		// Header
		header = "";
		header += "// ==UserScript==\n";
		header += "// @name        " + json.name + (tag || "") + "\n";
		header += "// @namespace   " + json.namespace + "\n";
		header += "// @author      " + json.author + "\n";
		header += "// @version     " + version + "\n";
		header += "// @description " + json.description + "\n";
		if (Array.isArray((list = json.targets))) {
			for (i = 0, ii = list.length; i < ii; ++i) {
				header += "// @include     " + list[i] + "\n";
			}
		}
		if (Array.isArray((list = json.connect_targets))) {
			for (i = 0, ii = list.length; i < ii; ++i) {
				header += "// @connect     " + list[i] + "\n";
			}
		}
		if (json.urls !== null && typeof(json.urls) === "object") {
			if (typeof((f = json.urls.homepage)) === "string") {
				header += "// @homepage    " + f + "\n";
			}
			if (typeof((f = json.urls.support)) === "string") {
				header += "// @supportURL  " + f + "\n";
			}
			if (!no_update) {
				f = path.relative(script_dir, output_meta).replace(/\\/g, "/");
				f = url.resolve(json.urls.update_base, f);
				header += "// @updateURL   " + f + "\n";

				f = path.relative(script_dir, output_file).replace(/\\/g, "/");
				f = url.resolve(json.urls.update_base, f);
				header += "// @downloadURL " + f + "\n";
			}
		}
		if (typeof((f = json.icon48)) === "string") {
			f = path.resolve(json_file_dir, f);
			header += "// @icon        data:image/png;base64," + fs.readFileSync(f).toString("base64") + "\n";
			requirements.push(f);
		}
		if (typeof((f = json.icon64)) === "string") {
			f = path.resolve(json_file_dir, f);
			header += "// @icon64      data:image/png;base64," + fs.readFileSync(f).toString("base64") + "\n";
			requirements.push(f);
		}
		ii = 0;
		if (Array.isArray((list = json.gm_permissions))) {
			for (i = 0, ii = list.length; i < ii; ++i) {
				header += "// @grant       " + list[i] + "\n";
			}
		}
		if (ii === 0) {
			header += "// @grant       none\n";
		}
		header += "// @run-at      document-start\n";
		header += "// ==/UserScript==";


		// Source code
		source = "";
		for (i = 0, ii = input_files.length; i < ii; ++i) {
			if (i > 0) source += "\n";
			source += get_source(input_files[i], {
				version: version,
				json: json,
				files: requirements,
				dependencies: new DependencyGraph()
			});
		}


		// Debug
		if (debug) {
			source = debug_wrap.debug_wrap_code(source, debug === "simple");
		}


		// Output
		fs.writeFileSync(output_file, header + "\n" + source, "utf8", function (err) {
			if (err) throw err;
		});

		if (!no_update) {
			fs.writeFileSync(output_meta, header, "utf8", function (err) {
				if (err) throw err;
			});
		}


		// Done
		return requirements;
	};


	var post_build = function () {
		var filename = path.resolve(script_dir, "post_build" + (is_windows ? ".bat" : ".sh")),
			cmd;

		if (fs.existsSync(filename)) {
			cmd = is_windows ? [ "cmd", "/s", "/c", filename ] : [ filename ];

			child_process.spawnSync(cmd[0], cmd.slice(1), { stdio: "inherit" });
		}
	};


	var build_complete = function (json_file, full_debug) {
		return try_wrapper(function () {
			var files = [],
				json = json_read(json_file, files),
				json_file_path = path.dirname(json_file),
				files_ext, i;

			files_ext = build(json, json_file_path, "", "", false, false);
			build(json, json_file_path, ".debug", " (debug)", true, (full_debug ? true : "simple"));

			process.stdout.write("Build successful\n");

			post_build(json);

			for (i = 0; i < files_ext.length; ++i) {
				files.push(files_ext[i]);
			}

			return uniquify(files);
		});
	};


	var watch_files = function (files, on_change) {
		var settings = { interval: 250 };
		var check = function (curr, prev) {
			if (curr.mtime > prev.mtime) {
				// Unwatch
				for (var i = 0, ii = files.length; i < ii; ++i) {
					fs.unwatchFile(files[i], check);
				}

				// Change
				on_change();
			}
		};

		for (var i = 0, ii = files.length; i < ii; ++i) {
			fs.watchFile(files[i], settings, check);
		}
	};


	// Main
	var main = function () {
		var files = [],
			dev = false,
			full_debug = false,
			required_files = [],
			f, i, arg;

		// Args
		for (i = 2; i < process.argv.length; ++i) {
			arg = process.argv[i];
			if (arg.substr(0, 2) === "--") {
				arg = arg.substr(2);
				if (arg === "dev") {
					dev = true;
				}
				else if (arg === "full") {
					full_debug = true;
				}
				else {
					process.stderr.write("Unknown option --" + arg + "\n");
				}
			}
			else {
				files.push(arg);
			}
		}

		// Default files
		if (files.length === 0) {
			files.push(path.normalize(path.resolve(script_dir, "./src/main.json")));
		}

		// Load
		for (i = 0; i < files.length; ++i) {
			f = build_complete(files[i], full_debug);
			required_files.push(f);
		}

		// Dev
		if (dev) {
			var on_watch_change_fn = function (files_pre, file, full_debug) {
				var fn = function () {
					var files = build_complete(file, full_debug);
					if (files !== undefined) {
						files_pre = files;
					}
					watch_files(files_pre, fn);
				};
				return fn;
			};

			for (i = 0; i < required_files.length; ++i) {
				watch_files(required_files[i], on_watch_change_fn(required_files[i], files[i], full_debug));
			}
		}
	};


	// Execute
	if (require.main === module) main();


})();

