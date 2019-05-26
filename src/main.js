/* jshint eqnull:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:true, undef:true, curly:false, browser:true, devel:true, newcap:false, maxerr:50, esnext:true */
(function (window, _GM) {
	"use strict";

	// Greasemonkey 4 compatibility
	const toPromise = (fn, self) => {
		return (...args) => {
			return new Promise((resolve, reject) => {
				try {
					resolve(fn.apply(self, args));
				}
				catch (e) {
					reject(e);
				}
			});
		};
	};
	const GM = ((GM) => {
		if (GM !== null && typeof(GM) === "object") {
			return GM;
		}

		const mapping = [
			[ "xmlHttpRequest", "GM_xmlhttpRequest" ]
		];

		GM = {};
		for (let i = 0, ii = mapping.length; i < ii; ++i) {
			let m = mapping[i];
			let fn = this[m[1]];
			GM[m[0]] = (typeof(fn) === "function") ? toPromise(fn, this) : null;
		}

		return GM;
	})(_GM);

	/*#{begin_debug:timing=true}#*/

	const config = {
		pageRequestDelayMin: 1.0, // Minimum wait before requesting another page
		pageRequestDelayMax: 1.1, // Maximum wait before requesting another page
		includeTitlesByDefault: false, // Include titles by default
	};

	const $ = (() => {
		const d = document;
		const $ = (selector, root) => (root || d).querySelector(selector);
		$.all = (selector, root) => (root || d).querySelectorAll(selector);
		$.on = (obj, eventName, callback, capture) => { if (obj) { obj.addEventListener(eventName, callback, capture || false); } };
		$.off = (obj, eventName, callback, capture) => { if (obj) { obj.removeEventListener(eventName, callback, capture || false); } };
		$.text = (text) => d.createTextNode(text || "");
		$.hasProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property);
		$.add = (parent, nodes) => {
			if (Array.isArray(nodes)) {
				for (let i = 0, ii = nodes.length; i < ii; ++i) {
					let n = nodes[i];
					if (n) { parent.appendChild(n); }
				}
			}
			else if (nodes) {
				parent.appendChild(nodes);
			}
		};
		$.before = (parent, next, nodes) => {
			if (!parent) { parent = next.parentNode; }
			if (Array.isArray(nodes)) {
				for (let i = 0, ii = nodes.length; i < ii; ++i) {
					let n = nodes[i];
					if (n) { parent.insertBefore(n, next); }
				}
			}
			else if (nodes) {
				parent.insertBefore(nodes, next);
			}
		};
		$.after = (parent, prev, nodes) => {
			if (!parent) { parent = prev.parentNode; }
			if (Array.isArray(nodes)) {
				for (let i = 0, ii = nodes.length; i < ii; ++i) {
					let n = nodes[i];
					if (n) { parent.insertBefore(n, prev.nextSibling); }
					prev = n;
				}
			}
			else if (nodes) {
				parent.insertBefore(nodes, prev.nextSibling);
			}
		};
		$.node = (tag, className, content) => {
			const elem = d.createElement(tag);
			if (typeof(className) === "string") {
				elem.className = className;
			}
			if (typeof(content) === "string") {
				elem.textContent = content;
			}
			else if (typeof(content) === "object" && content !== null) {
				for (let k in content) {
					elem[k] = content[k];
				}
			}
			return elem;
		};
		$.insertStyles = (styles) => {
			let head = d.head;
			if (head) {
				let n = d.createElement("style");
				n.textContent = styles;
				head.appendChild(n);
			}
		};
		$.toHtml = function (text, def) {
			try {
				return new DOMParser().parseFromString(text, "text/html");
			}
			catch (e) {}
			return def;
		};
		$.ready = (() => {
			let callbacks = [],
				checkInterval = null,
				checkIntervalTime = 250;

			const runFunctions = (callbacks) => {
				for (let i = 0, ii = callbacks.length; i < ii; ++i) {
					callbacks[i]();
				}
			};
			const check = () => {
				if ((document.readyState === "interactive" || document.readyState === "complete") && callbacks !== null) {
					const cbs = callbacks;
					callbacks = null;

					$.off(window, "load", check);
					$.off(window, "DOMContentLoaded", check);
					$.off(document, "readystatechange", check);

					if (checkInterval !== null) {
						clearInterval(checkInterval);
						checkInterval = null;
					}

					runFunctions(cbs);
					return true;
				}
				return false;
			};

			$.on(window, "load", check);
			$.on(window, "DOMContentLoaded", check);
			$.on(document, "readystatechange", check);

			return (cb) => {
				if (callbacks === null) {
					cb();
				}
				else {
					callbacks.push(cb);
					if (checkInterval === null && check() !== true) {
						checkInterval = setInterval(check, checkIntervalTime);
					}
				}
			};
		})();
		$.ajax = (() => {
			const gmSupported = (typeof(GM.xmlHttpRequest) === "function");

			const ajaxGM = (details) => { GM.xmlHttpRequest(details); };
			const ajaxNative = (() => {
				const events = [ "onabort", "onerror", "onload", "onprogress", "onreadystatechange", "ontimeout" ];
				const uploadEvents = [ "onabort", "onerror", "onload", "onprogress" ];

				const constructEventData = (xhr, e, context) => {
					return {
						readyState: xhr.readyState,
						responseHeaders: xhr.getAllResponseHeaders(),
						responseText: xhr.responseText,
						status: xhr.status,
						statusText: xhr.statusText,
						context: context,
						lengthComputable: e.lengthComputable,
						loaded: e.loaded,
						total: e.total
					};
				};

				const hookEvents = (details, xhr, obj, events) => {
					let context = details.context;
					for (let i = 0, ii = events.length; i < ii; ++i) {
						let event = events[i];
						let callback = details[event];
						if (typeof(callback) === "function") {
							obj.addEventListener(event.substr(2), (e) => callback(constructEventData(xhr, e, context)), false);
						}
					}
				};

				return (details) => {
					let xhr = new XMLHttpRequest();

					hookEvents(details, xhr, xhr, events);
					hookEvents(details, xhr, xhr.upload, uploadEvents);

					xhr.open(details.method, details.url, !details.synchronous);

					if (typeof(details.headers) === "object" && details.headers !== null) {
						for (let k in details.headers) {
							xhr.setRequestHeader(k, details.headers[k]);
						}
					}
					if ($.hasProperty(details, "user") && $.hasProperty(details, "password")) {
						xhr.setRequestHeader("Authorization", "Basic " + window.btoa(details.user + ":" + details.password));
					}
					if ($.hasProperty(details, "timeout")) {
						xhr.timeout = details.timeout;
					}
					if ($.hasProperty(details, "overrideMimeType")) {
						xhr.overrideMimeType(details.overrideMimeType);
					}

					let data;
					if ($.hasProperty(details, "data")) {
						data = details.data;
						if (details.binary) { data = new Blob([ data ]); }
					}
					xhr.send(data);
				};
			})();
			const ajax = (details, dontUseGM) => {
				return (gmSupported && !dontUseGM ? ajaxGM(details) : ajaxNative(details));
			};

			return ajax;
		})();
		return $;
	})();

	const EHAPI = (() => {
		const rePaginationInfo = /([\d,]+)\s*-\s*([\d,]+)\s*of\s*([\d,]+)/i;
		const reComma = /,/g;
		const isEx = (("" + window.location.hostname).toLowerCase().indexOf("exhentai.org") >= 0);

		class PaginationInfo {
			constructor() {
				this.entryStart = 0;
				this.entryCount = 0;
				this.entryTotal = 0;
				this.pageCount = 0;
				this.pageCurrent = 0;
			}
		}

		class IndexPageInfo {
			constructor(error) {
				this.error = error;
				this.galleries = [];
			}
		}

		class IndexPageGalleryInfo {
			constructor(url, title) {
				this.url = url;
				this.title = title;
			}
		}


		PaginationInfo.create = (html) => {
			const info = new PaginationInfo();
			let n, m;

			if (
				(n = $(".ido p.ip,.gtb p.gpc", html)) !== null &&
				(m = rePaginationInfo.exec(n.textContent)) !== null
			) {
				info.entryStart = (parseInt(m[1].replace(reComma, ""), 10) || 0) - 1;
				info.entryCount = (parseInt(m[2].replace(reComma, ""), 10) || 0) - info.entryStart;
				info.entryTotal = (parseInt(m[3].replace(reComma, ""), 10) || 0);
			}

			if ((n = $(".ptt td:nth-last-child(2)", html)) !== null) {
				info.pageCount = parseInt(n.textContent.trim(), 10) || 0;
			}

			if ((n = $(".ptt .ptds", html)) !== null) {
				info.pageCurrent = (parseInt(n.textContent.trim(), 10) || 0) - 1;
			}

			return info;
		};

		const getPageType = (html) => {
			if ($("input[name='favcat']", html) !== null) { return "favorites"; }
			return null;
		};

		return {
			PaginationInfo: PaginationInfo,
			IndexPageInfo: IndexPageInfo,
			IndexPageGalleryInfo: IndexPageGalleryInfo,
			isEx: isEx,
			getPageType: getPageType,
		};
	})();

	const main = (() => {
		const d = document;
		const de = d.documentElement;

		class Exporter {
			constructor() {
				this.paginationInfo = EHAPI.PaginationInfo.create(de);
				this.paginationUrl = window.location.href.replace(/#[\w\W]*$/, "");

				this.pages = [];
				this.galleries = [];

				this.pagesString = "";
				this.downloadUrl = null;
				this.downloadFileName = "favorites.txt";

				this._includeTitle = config.includeTitlesByDefault;

				this._isPaused = true;
				this._requestActive = false;
				this._requestProgress = 0.0;
				this._completed = false;

				this._setupUI();
				let relative = $("div>form", de);
				if (relative !== null) { $.after(null, relative, this._nContentRoot); }
			}

			getPageUrl(index) {
				let url = this.paginationUrl;
				let re = /([&\?]page=)([^&]*)(&|$)/;
				let m = re.exec(url);
				if (m === null) {
					url += (url.indexOf("?") >= 0 ? "&" : "?") + "page=" + index;
				}
				else {
					url = url.substr(0, m.index) + m[1] + index + m[3] + url.substr(m.index + m[0].length);
				}
				return url;
			}

			isPaused() {
				return this._isPaused;
			}

			setPaused(paused) {
				if (paused) {
					this._isPaused = true;
				}
				else if (!this._completed) {
					this._isPaused = false;
					this._resume();
				}
				this._updateTitle();
			}

			includeTitle() {
				return this._includeTitle;
			}
			setIncludeTitle(includeTitle) {
				this._includeTitle = includeTitle;
				this._updateTitlesLink();
				this._updateFullPagesString();
			}

			_resume() {
				if (this._requestActive || this._completed || this._completeCheck()) { return; }

				let pageIndex = this.pages.length;
				this._requestActive = true;
				if (this.paginationInfo.pageCurrent === pageIndex) {
					this._onRequestComplete(de, 0);
				}
				else {
					$.ajax({
						// url: "http://127.0.0.1",//
						url: this.getPageUrl(pageIndex),
						method: "GET",
						onload: (e) => { this._onRequestProgress(e); this._onRequestComplete($.toHtml(e.responseText, null, 1)); },
						onerror: () => { this._onRequestComplete(null, 2); },
						onprogress: (e) => { this._onRequestProgress(e); }
					});
				}
			}

			_completeCheck() {
				if (this.pages.length >= this.paginationInfo.pageCount) {
					this._requestActive = false;
					this._onAllRequestsCompleted();
					return true;
				}
				return false;
			}

			_onRequestProgress(e) {
				if (!e.lengthComputable) { return; }

				this._requestProgress = e.loaded / e.total;
				this._updateProgress();
			}
			_onRequestComplete(html, delayType) {
				this._requestProgress = 0.0;

				const page = (html !== null) ? this._parseHTML(html) : new EHAPI.IndexPageInfo("Invalid");

				this.pages.push(page);
				for (let i = 0, ii = page.galleries.length; i < ii; ++i) {
					this.galleries.push(page.galleries[i]);
				}

				this._updateEntryDisplay(page);

				if (this._completeCheck()) { return; }

				this._updateProgress();

				if (delayType === 0) {
					this._onRequestProcessingCompleted();
				}
				else {
					let delay = config.pageRequestDelayMin + (config.pageRequestDelayMax - config.pageRequestDelayMin) * Math.random();
					setTimeout(() => this._onRequestProcessingCompleted(), delay * 1000);
				}
			}
			_onRequestProcessingCompleted() {
				this._requestActive = false;
				if (!this._isPaused) {
					this._resume();
				}
			}
			_onAllRequestsCompleted() {
				this._completed = true;
				this._updateProgress();
				this.setPaused(true);
			}

			_parseHTML(html) {
				let info = new EHAPI.IndexPageInfo(null);

				let elements = $.all(".itg .glname a[href]", html);
				if (elements.length === 0) {
					elements = $.all(".itg.glte tr>td.gl2e>div>a[href]", html);
				}

				for (let i = 0, ii = elements.length; i < ii; ++i) {
					let e = elements[i];
					let url = e.getAttribute("href");
					if (url) {
						info.galleries.push(new EHAPI.IndexPageGalleryInfo(url, e.textContent.trim()));
					}
				}

				return info;
			}

			_setupUI() {
				let n0, n1, n2, n3, n4;

				n0 = $.node("div", "xport_info_box");
				this._nContentRoot = n0;

				// Header
				$.add(n0, (n1 = $.node("div", "xport_info_header")));
				$.add(n1, (n2 = $.node("div", "xport_info_progress_container1")));
				$.add(n2, (n3 = $.node("div", "xport_info_progress_container2")));
				$.add(n3, (n4 = $.node("div", "xport_info_progress")));
				this._nProgressBar = n4;
				$.add(n1, (n2 = $.node("div", "xport_info_header_content")));
				$.add(n2, (n3 = $.node("span", "xport_info_header_title")));
				this._nTitle = n3;
				$.add(n2, (n3 = $.node("span", "xport_info_header_status", { textContent: "0%" })));
				this._nStatus = n3;

				// Content
				$.add(n0, (n1 = $.node("div", "xport_info_content")));
				$.add(n1, (n2 = $.node("div", "xport_info_content_links")));
				$.add(n2, (n3 = $.node("a", "xport_info_content_link", { textContent: "Show List" })));
				$.on(n3, "click", (e) => this._onShow(e));
				this._nToggleList = n3;
				$.add(n2, $.text(" | "));
				$.add(n2, (n3 = $.node("a", "xport_info_content_link", { textContent: "Copy" })));
				$.on(n3, "click", (e) => this._onCopy(e));
				$.add(n2, $.text(" | "));
				$.add(n2, (n3 = $.node("a", "xport_info_content_link", { textContent: "Download" })));
				$.on(n3, "click", (e) => this._onDownload(e));
				this._nDownloadLink = n3;
				$.add(n2, $.text(" | "));
				$.add(n2, (n3 = $.node("a", "xport_info_content_link")));
				$.on(n3, "click", (e) => this._onToggleTitles(e));
				this._nTitlesToggleLink = n3;
				$.add(n2, $.text(" | "));
				$.add(n2, (n3 = $.node("span", "xport_info_content_text", { textContent: "Total: 0" })));
				this._nTotalCounter = n3;

				// Text field
				$.add(n0, (n1 = $.node("div", "xport_info_textarea_container xport_info_textarea_container_hidden")));
				this._nTextAreaContainer = n1;
				$.add(n1, (n2 = $.node("div", "xport_info_textarea_line_container")));
				$.add(n2, $.node("div", "xport_info_textarea_line"));
				$.add(n1, (n2 = $.node("textarea", "xport_info_textarea", { spellcheck: false, placeholder: "", value: "" })));
				this._nTextArea = n2;

				// Copy area
				$.add(n0, (n1 = $.node("textarea", "xport_hidden_textarea")));
				n1.style.display = "none";
				this._nCopyTextArea = n1;

				this._updateTitle();
				this._updateTitlesLink();
			}
			_invalidateDownloadUrl() {
				if (this.downloadUrl !== null) {
					window.URL.revokeObjectURL(this.downloadUrl);
					this.downloadUrl = null;
					this._nDownloadLink.removeAttribute("href");
					this._nDownloadLink.removeAttribute("download");
				}
			}
			_updateTitle() {
				if (this._completed) {
					this._nTitle.textContent = "Exported";
					this._nStatus.classList.add("xport_info_header_status_hidden");
				}
				else {
					this._nTitle.textContent = this._isPaused ? "Paused: " : "Exporting: ";
					this._nStatus.classList.remove("xport_info_header_status_hidden");
				}
			}
			_updateDownloadUrl() {
				if (this.downloadUrl === null) {
					let blob = new Blob([ this.pagesString ], { type: "text/plain" });
					this.downloadUrl = window.URL.createObjectURL(blob);
					this._nDownloadLink.setAttribute("href", this.downloadUrl);
					this._nDownloadLink.setAttribute("download", this.downloadFileName);
				}
			}
			_updateProgress() {
				let p = this.paginationInfo.pageCount;
				p = (p > 0) ? (this.pages.length + this._requestProgress) / p : 1.0;
				p *= 100;
				this._nProgressBar.style.width = p + "%";
				this._nStatus.textContent = Math.floor(p) + "%";
			}
			_updateTitlesLink() {
				this._nTitlesToggleLink.textContent = (this._includeTitle ? "Omit Titles" : "Include Titles");
			}
			_updateFullPagesString() {
				this.pagesString = "";
				for (let i = 0, ii = this.pages.length; i < ii; ++i) {
					this._updatePagesString(this.pages[i]);
				}
				this._invalidateDownloadUrl();
				this._nTextArea.value = this.pagesString;
			}
			_updatePagesString(newestPage) {
				for (let i = 0, ii = newestPage.galleries.length; i < ii; ++i) {
					let e = newestPage.galleries[i];
					if (this.pagesString.length > 0) { this.pagesString += "\r\n"; }
					this.pagesString += e.url;
					if (this._includeTitle) { this.pagesString += " - " + e.title; }
				}
			}
			_updateEntryDisplay(newestPage) {
				this._updatePagesString(newestPage);
				this._invalidateDownloadUrl();
				this._nTextArea.value = this.pagesString;

				this._nTotalCounter.textContent = "Total: " + this.galleries.length;
			}

			_onDownload() {
				this._updateDownloadUrl();
			}
			_onCopy() {
				this._nCopyTextArea.style.display = "block";
				try {
					this._nCopyTextArea.value = (this.pagesString.length > 0 ? this.pagesString : " ");
					this._nCopyTextArea.focus();
					this._nCopyTextArea.select();
					document.execCommand("copy");
					this._nCopyTextArea.blur();
				}
				catch (e)
				{}
				this._nCopyTextArea.value = "";
				this._nCopyTextArea.style.display = "none";
			}
			_onShow(e) {
				let hidden = this._nTextAreaContainer.classList.toggle("xport_info_textarea_container_hidden");
				e.currentTarget.text = hidden ? "Show List" : "Hide List";
				if (!hidden) {
					this._nTextArea.focus();
					this._nTextArea.select();
				}
			}
			_onToggleTitles() {
				this.setIncludeTitle(!this._includeTitle);
			}
		}
		Exporter.current = null;

		const setupFavorites = () => {
			const button = $("input[type=button][value=Clear]", de);
			if (button !== null) {
				const exportButton = $.node("input", null, { type: "button", value: "Export..." });
				$.after(null, button, [ $.text(" "), exportButton ]);
				$.on(exportButton, "click", () => {
					if (Exporter.current === null) {
						Exporter.current = new Exporter();
						Exporter.current.setPaused(false);
					}
					else {
						Exporter.current.setPaused(!Exporter.current.isPaused());
					}
				});
			}
		};

		const main = () => {
			$.insertStyles("#{style:../resources/stylesheets/style.css}#");
			if (EHAPI.isEx) { de.classList.add("xport_ex"); }

			const pageType = EHAPI.getPageType(de);

			if (pageType === "favorites") {
				setupFavorites();
			}
		};

		return main;
	})();

	$.ready(main);

}).call(this, window, (() => { try { return GM; } catch (e) { return undefined; } })());