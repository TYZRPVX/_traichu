// ==UserScript==
// @name         X Hack CSS
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description
// @author       Body Builder
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @run-at-note  https://tampermonkey.net/documentation.php#_run_at
// @icon         https://cdn1.iconfinder.com/data/icons/logotypes/32/badge-css-3-128.png
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_common.js
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_hack_css.js
// ==/UserScript==


function main() {
	document.documentElement.classList.add(X.platform);

	GM_registerMenuCommand("[+] 激活阅读模式", () => readModeCss("+"));
	GM_registerMenuCommand("[-] 取消阅读模式", () => readModeCss("-"));
}
