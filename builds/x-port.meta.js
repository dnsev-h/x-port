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