// ==UserScript==
// @name        X-Port
// @namespace   dnsev-h
// @author      dnsev-h
// @version     1.0.0
// @description Export favorites on E*Hentai
// @include     https://exhentai.org/*
// @include     https://e-hentai.org/*
// @connect     exhentai.org
// @connect     e-hentai.org
// @homepage    https://dnsev-h.github.io/x-port/
// @supportURL  https://github.com/dnsev-h/x-port/issues
// @updateURL   https://raw.githubusercontent.com/dnsev-h/x-port/master/builds/x-port.meta.js
// @downloadURL https://raw.githubusercontent.com/dnsev-h/x-port/master/builds/x-port.user.js
// @icon        data:image/png;base64,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
// @icon64      data:image/png;base64,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
// @grant       none
// @run-at      document-start
// ==/UserScript==
(function (window) {
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
	const GM = (() => {
		let GM = this.GM;
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
	})();

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

				let elements = $.all(".itg>.id1>.id2>a[href]", html);
				if (elements.length === 0) {
					elements = $.all(".itg tr>.itd>div>.it5>a[href]", html);
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
			const button = $("input[name=f_clear]", de);
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
			$.insertStyles(".xport_info_box{width:50%;margin:.5em auto 0;padding:0;border-radius:3px;background-color:#e3e0d1;border:1px solid #5c0d12;text-align:left;overflow:hidden}:root.xport_ex .xport_info_box{border-radius:0;background-color:#43464e;border:1px solid #aeaeae}.xport_info_header{padding:.25em .25em .125em;position:relative}.xport_info_header_content{font-weight:700;position:relative}.xport_info_header_status.xport_info_header_status_hidden{display:none}.xport_info_progress_container1{position:absolute;left:9em;top:.2em;bottom:.2em;right:.2em;background-color:#f2f0e4;border:1px solid #ceb6b7}.xport_info_progress_container2{position:absolute;left:0;top:0;bottom:0;right:0;border:1px solid #fff}.xport_info_progress{background-color:#ceb6b7;width:0;height:100%}:root.xport_ex .xport_info_progress_container1{background-color:#43464e;border-color:#34353b}:root.xport_ex .xport_info_progress_container2{border:1px solid #4f535b}:root.xport_ex .xport_info_progress{background-color:#34353b}.xport_info_content{padding:.125em .25em .25em;position:relative}.xport_info_content_links{position:relative}.xport_info_content_link{text-decoration:none;cursor:pointer}.xport_info_textarea_container{display:block}.xport_info_textarea_container.xport_info_textarea_container_hidden{display:none}.xport_info_textarea_line_container{margin:0}.xport_info_textarea_line{border-top:1px solid #ceb6b7}:root.xport_ex .xport_info_textarea_line{border-top:1px solid #aeaeae}textarea.xport_info_textarea{margin:0;padding:.25em;border:0;resize:vertical;width:100%;height:5.5em;min-height:3em;line-height:1.25em;font-size:1em;font-family:inherit;border-radius:0;box-sizing:border-box;display:block;white-space:pre;overflow-wrap:normal;overflow:auto}textarea.xport_info_textarea,textarea.xport_info_textarea:active,textarea.xport_info_textarea:focus,textarea.xport_info_textarea:hover{background-color:#f2f0e4}:root.xport_ex textarea.xport_info_textarea,:root.xport_ex textarea.xport_info_textarea:active,:root.xport_ex textarea.xport_info_textarea:focus,:root.xport_ex textarea.xport_info_textarea:hover{background-color:#34353b}");
			if (EHAPI.isEx) { de.classList.add("xport_ex"); }

			const pageType = EHAPI.getPageType(de);

			if (pageType === "favorites") {
				setupFavorites();
			}
		};

		return main;
	})();

	$.ready(main);

}).call(this, window);