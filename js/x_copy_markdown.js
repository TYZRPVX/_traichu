// ==UserScript==
// @name         X Copy MarkDown
// @namespace    https://gist.github.com/vhxubo/e94b0cceadf0291050f05ab1c0bb19c9
// @homepage     https://gist.github.com/vhxubo/e94b0cceadf0291050f05ab1c0bb19c9
// @version      0.4
// @description  快速复制 MarkDown 格式的超链接到剪贴板，格式: [标题](网址)
// @author       X
// @note         新增快捷键快速复制标题及链接：Alt + k，修改第22行的代码实现自定义，键值请参见：https://keycode.info/
// @note         请勿同时使用其它快捷键插件/脚本
// @match        *://*/*
// @icon         https://cdn.iconscout.com/icon/free/png-128/markdown-486861-2364930.png
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-idle
// @require      file:///Users/x/git/dotfiles/common/Browser/Tampermonkey/x_common.js
// ==/UserScript==


function getRootDomain(url) {
	let domain = new URL(url).hostname;
	const splitDomain = domain.split('.').slice(-2);
	const rootDomain = splitDomain.join('.');
	return rootDomain;
}

function splitClearTitle(url, title) {

	// Check if the URL matches the pattern
	if (/git.garena.com/.test(url)) {
		const splitParts = title.split('·');
		return splitParts[0];
	}
	if (/jira.shopee.io/.test(url)) {
		const removeHeaders = title.replace(/【.+】/g, '[Tech] ');
		const lastIndex = removeHeaders.lastIndexOf("-");
		const finalString = lastIndex !== -1 ? removeHeaders.substring(0, lastIndex) : removeHeaders;
		return finalString;
	}

	return title;
}

const MarkDown = "MarkDown";
const TitleOnly = "TitleOnly";
const UrlOnly = "UrlOnly";
const TitleUrl = "TitleUrl";
const RichTitle = "RichTitle";

function highlightCopyComplex(scene) {

	const clearTitle = splitClearTitle(document.URL, document.title);
	const rootDomain = getRootDomain(document.URL);
	var chars = "";
	switch (scene) {
		case MarkDown:
			if (clearTitle.search("[|-]") == -1) {
				chars = `[${clearTitle} • ${rootDomain}](${document.URL})`;
			} else {
				chars = `[${clearTitle}](${document.URL})`;
			}
			GM_setClipboard(chars);
			break;
		case TitleOnly:
			chars = `${clearTitle}`;
			GM_setClipboard(chars, 'text');
			break;
		case UrlOnly:
			chars = `${document.URL}`;
			GM_setClipboard(chars, 'text');
			break;
		case RichTitle:
			chars = `${clearTitle}`;
			var linkHtml = '<a href="' + window.location.href + '">' + chars + '</a>';
			GM_setClipboard(linkHtml, 'html');
			chars = `//  ${clearTitle}  //`;
			break;
		case TitleUrl:
			chars = `${clearTitle} - ${document.URL}`;
			GM_setClipboard(chars);
			break;
	}
	log(`${document.title} -> ${clearTitle} at ${rootDomain}`);
	showToast(`${chars}`);
}

function main() {
	GM_registerMenuCommand("MarkDown Title `[Title](URL)`", () => highlightCopyComplex(MarkDown));
	GM_registerMenuCommand("// Rich Title //", () => highlightCopyComplex(RichTitle));
	GM_registerMenuCommand("Title with URL", () => highlightCopyComplex(TitleUrl));
	GM_registerMenuCommand("Only Plain Title", () => highlightCopyComplex(TitleOnly));

	document.onkeydown = function (event) {
		// 74 is <j>, 75 is <k>, https://www.toptal.com/developers/keycode
		console.log(`Key: ${event.key}, KeyCode: ${event.keyCode}`);
		if (event.altKey && event.keyCode == 74) {
			highlightCopyComplex(RichTitle);
		}
		if (event.altKey && event.keyCode == 75) {
			highlightCopyComplex(MarkDown);
		}
		if (event.altKey && event.keyCode == 76) {
			highlightCopyComplex(UrlOnly);
		}
		if (event.altKey && event.keyCode == 85) { // u
			highlightCopyComplex(TitleUrl);
		}
	}
}