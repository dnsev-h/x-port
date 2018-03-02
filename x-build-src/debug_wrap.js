/* jshint eqnull:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:true, undef:true, curly:false, node:true, browser:true, devel:true, newcap:false, maxerr:50 */
(function (module) {
	"use strict";

	var Complexion = require("complexion"),
		ComplexionJS = require("complexion-js");

	// begin_debug

	var window = {};
	var timing_fn = function () {
		var perf = window.performance,
			now, fn;

		if (!perf || !(now = perf.now || perf.mozNow || perf.msNow || perf.oNow || perf.webkitNow)) {
			perf = Date;
			now = perf.now;
		}

		fn = function () { return now.call(perf); };
		fn.start = now.call(perf);
		return fn;
	};
	var timing = timing_fn();

	var wrap_setup = function (simple) {
		var error_node = null,
			function_names = [],
			total_counter = 0,
			function_counters = {},
			timing_init = timing();

		var set_timeout_0ms = (function () {
			var callbacks = {},
				origin = window.location.protocol + "//" + window.location.host;

			var random_gen = function (count) {
				var s = "",
					i;

				for (i = 0; i < count; ++i) s += ("" + Math.random()).replace(/\./, "");

				return s;
			};

			window.addEventListener("message", function (event) {
				if (event.origin === origin && event.data !== null && typeof(event.data) === "object") {
					var key = event.data.set_timeout_0ms;
					if (key in callbacks) {
						callbacks[key].call(null);
						delete callbacks[key];
					}
				}
			}, false);

			var fn = function (callback) {
				var key = random_gen(4);
				callbacks[key] = callback;
				try {
					window.postMessage({ set_timeout_0ms: key }, origin);
				}
				catch (e) {
					delete callbacks[key];
					setTimeout(function () {
						callback.call(null);
					}, 1);
				}
				return key;
			};
			fn.clear = function (key) {
				delete callbacks[key];
			};
			return fn;
		})();

		var format_stack = function (stack) {
			var output = "",
				line_number = 0,
				line, i, ii, p;

			stack = stack.trim().replace(/\r\n/g, "\n").split("\n");
			for (i = 0, ii = stack.length; i < ii; ++i) {
				line = stack[i];
				if ((p = line.indexOf("@")) >= 0) {
					++p;
					line = line.substr(0, p) + line.substr(p).replace(/[\w\-]+:(?:[\w\W]*?)([^\/]+?\.js)/ig, "$1");
				}

				if (!/^\s*Function\.prototype\._w/.test(line)) {
					if (line_number++ > 0) output += "\n";
					output += line;
				}
			}

			return output;
		};
		var log = function (exception) {
			if (error_node === null) {
				var n0 = document.body || document.documentElement,
					n1 = document.createElement("div"),
					n2 = document.createElement("textarea");

				n1.setAttribute("style", "position:fixed!important;right:0!important;top:0!important;bottom:0!important;width:20em!important;opacity:0.8!important;background:#fff!important;color:#000!important;z-index:999999999!important;");
				n2.setAttribute("style", "position:absolute!important;left:0!important;top:0!important;width:100%!important;height:100%!important;padding:0.5em!important;margin:0!important;color:inherit!important;background:transparent!important;font-family:inherit!important;font-size:8px!important;line-height:1.1em!important;border:none!important;resize:none!important;font-family:Courier,monospace!important;box-sizing:border-box!important;cursor:initial!important;");
				n2.spellcheck = false;
				n2.readOnly = true;
				n2.wrap = "off";
				n1.appendChild(n2);
				if (n0) n0.appendChild(n1);

				error_node = n2;
			}

			var s = "";
			if (error_node.value.length > 0) s += "\n====================\n";
			s += "" + exception + "\n" + (format_stack("" + exception.stack));
			error_node.value += s;

			console.log("Exception:", exception);
		};

		var increase_counter = function (fn_index) {
			++total_counter;
			if (fn_index in function_counters) {
				++function_counters[fn_index];
			}
			else {
				function_counters[fn_index] = 1;

				if (log_calls_timer === null) {
					log_calls_timer = set_timeout_0ms(log_calls);
				}
			}
		};

		var log_calls_timer = null;
		var log_calls = function () {
			log_calls_timer = null;

			// Sort keys by name
			var time_diff = timing() - timing_init,
				keys = Object.keys(function_counters),
				sortable = [],
				count, i;

			for (i = 0; i < keys.length; ++i) {
				sortable.push([ function_counters[keys[i]], parseInt(keys[i], 10) ]);
			}

			sortable.sort(function (a, b) {
				if (a[0] > b[0]) return -1;
				if (a[0] < b[0]) return 1;
				if (a[1] > b[1]) return -1;
				if (a[1] < b[1]) return 1;
				return 0;
			});

			for (i = 0; i < sortable.length; ++i) {
				sortable[i] = function_names[sortable[i][1]] + ": " + sortable[i][0];
			}

			count = total_counter;
			total_counter = 0;
			function_counters = {};

			if (time_diff >= 10000) {
				time_diff = (time_diff / 1000).toFixed(1) + "s";
			}
			else {
				time_diff = time_diff.toFixed(0) + "ms";
			}

			// Log
			console.log("[Debug Function Call Counter] Init+" + time_diff + ": call_count=" + count + ";", sortable);
		};

		var last_error;
		var last_error_clear_timer = false;
		var last_error_clear = function () {
			last_error = undefined;
			last_error_clear_timer = false;
		};
		Function.prototype._w = function (fn_index) {
			var fn = this;
			return function () {
				if (!simple) increase_counter(fn_index);

				try {
					return fn.apply(this, arguments);
				}
				catch (e) {
					if (last_error !== e) {
						if (!last_error_clear_timer) {
							last_error_clear_timer = true;
							set_timeout_0ms(last_error_clear);
						}
						last_error = e;
						log(e);
					}
					throw e;
				}
			};
		};
	};

	var stringify_function = function (fn, indent) {
		return fn.toString().replace(/\n\t/g, "\n" + indent);
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

	var debug_wrap_code = function (source, simple) {
		var instance = new Complexion(),
			parens = 0,
			start_parens = -1,
			token_pre = null,
			token_pre_name = null,
			token_pre_any = null,
			function_starts = [],
			output = "",
			function_names = [],
			function_name_pos = -1,
			tokens, token, before, after, indent, name, args, fs, m, t, c, i;

		ComplexionJS(instance);
		tokens = instance.tokenize(source);

		for (i = 0; i < tokens.length; ++i) {
			token = tokens[i];
			before = "";
			after = "";
			c = token.content;

			if (!token.isAnyType([ "WHITESPACE", "LINE_TERMINATOR", "SINGLE_LINE_COMMENT", "MULTI_LINE_COMMENT", "BOM", "SHEBANG", "UNKNOWN" ])) {
				if (token.isType("KEYWORD")) {
					if (c === "function") {
						name = (token_pre_name === null ? "?" : token_pre_name.content);
						t = (function_starts.length > 0 ? function_names[function_starts[function_starts.length - 1][1]] : "?");
						if (t !== "?") name = t + "." + name;
						function_starts.push([ parens, function_names.length ]);
						function_names.push(name);
					}
				}
				else if (token.isType("PUNCTUATOR")) {
					if (c === "[" || c === "(" || c === "{") {
						++parens;
					}
					else if (c === "]" || c === ")" || c === "}") {
						--parens;
						if (
							c === "}" &&
							function_starts.length > 0 &&
							(fs = function_starts[function_starts.length - 1])[0] === parens
						) {
							function_starts.pop();
							if (token_pre_any !== null && token_pre_any.isType("MULTI_LINE_COMMENT") && (m = /\/\*\s*no_debug\s*\*\//.exec(token_pre_any.content)) !== null) {
								// Remove
								output = output.substr(0, output.length - m[0].length);
							}
							else {
								if (start_parens >= 0 && parens >= start_parens) {
									after = "._w(" + fs[1] + ")";
								}
							}
						}
					}
				}

				if (token.isAnyType([ "KEYWORD", "NULL_LITERAL", "NUMERIC_LITERAL", "IDENTIFIER_NAME" ])) {
					token_pre_name = token;
				}
				else if (token.isAnyType([ "PUNCTUATOR" ])) {
					if (c !== "[" && c !== "(" && c !== "{" && c !== ":" && c !== "=") {
						token_pre_name = null;
					}
				}
				else {
					token_pre_name = null;
				}

				token_pre = token;
			}
			else if (start_parens < 0 && token.isType("MULTI_LINE_COMMENT")) {
				if ((m = /\/\*\#\{begin_debug(?::(.*))?\}\#\*\//.exec(c)) !== null) {
					start_parens = parens;
					indent = /(?:^|\n)([\t ]*)$/.exec(output);
					indent = (indent === null) ? "" : indent[1];
					c = "";
					if (m[1] !== undefined) {
						args = to_args(m[1]);
						if (args.timing === "true") {
							c += "var timing = (" + stringify_function(timing_fn, indent) + ")();\n" + indent;
						}
					}
					c += "(" + stringify_function(wrap_setup, indent) + ")(" + simple + ");";

					// Position
					if (!simple) {
						function_name_pos = c.indexOf("function_names = []");
						if (function_name_pos >= 0) {
							function_name_pos += output.length + before.length + ("function_names = ").length;
						}
					}
				}
			}

			// Output
			output += before;
			output += c;
			output += after;

			token_pre_any = token;
		}

		if (function_name_pos >= 0) {
			output = output.substr(0, function_name_pos) + JSON.stringify(function_names) + output.substr(function_name_pos + 2);
		}

		return output;
	};

	module.exports = {
		debug_wrap_code: debug_wrap_code
	};

})(module);

