// ==UserScript==
// @name         X Copy MarkDown
// @namespace    https://gist.github.com/vhxubo/e94b0cceadf0291050f05ab1c0bb19c9
// @homepage     https://gist.github.com/vhxubo/e94b0cceadf0291050f05ab1c0bb19c9
// @version      0.5
// @description  快速复制 MarkDown 格式的超链接到剪贴板，格式: [标题](网址)
// @author       X
// @note         新增快捷键快速复制标题及链接：Alt + k，修改第22行的代码实现自定义，键值请参见：https://keycode.info/
// @note         请勿同时使用其它快捷键插件/脚本
// @match        http://*/*
// @match        https://*/*
// @icon         https://cdn.iconscout.com/icon/free/png-128/markdown-486861-2364930.png
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_common.js
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_copy_markdown.js
// ==/UserScript==

// @require      file:///Users/x/git/dotfiles/common/Browser/Tampermonkey/x_common.js
// @require      file:///Users/x/git/dotfiles/common/Browser/Tampermonkey/x_copy_markdown.js
// @require      file://C:/git/dotfiles/common/Browser/Tampermonkey/x_common.js
// @require      file://C:/git/dotfiles/common/Browser/Tampermonkey/x_copy_markdown.js

// z _traichu && cd js
// node Tampermonkey/sync_tampermonkey.js
// GIT PUSH
// FORCE CDN REFRESH https://purge.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_copy_markdown.js
// FORCE REFRESH TAMERMONKEY chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=a97b683d-6889-4884-b41a-b5f56dca0b81+externals

function getSiteName(url) {
	let hostname = new URL(url).hostname;
	hostname = hostname.replace(/^www\./, '');
	// Get the main domain name (e.g., github.com -> github, google.com -> google)
	const mainDomain = hostname.split('.')[0];
	return mainDomain;
}

const MarkDown = "MarkDown";
const TitleOnly = "TitleOnly";
const UrlOnly = "UrlOnly";
const TitleUrl = "TitleUrl";
const RichTitle = "RichTitle";

function highlightCopyComplex(scene) {

	const clearTitle = document.title;
	const siteName = getSiteName(document.URL);
	var chars = "";
	switch (scene) {
		case MarkDown:
			if (clearTitle.search("[|-]") == -1) {
				chars = `[${clearTitle} - ${siteName}](${document.URL})`;
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
	// log(`${document.title} -> ${clearTitle} FULL: ${document.URL} SITE: ${siteName}`);
	showToast(`${chars}`);
}

function createCopyMenu() {
	const menuItems = [
		{ label: 'MarkDown [Title](URL)', action: MarkDown, key: 'K' },
		{ label: 'Title with URL', action: TitleUrl, key: 'U' },
		{ label: 'Rich Title (HTML)', action: RichTitle, key: '' },
		{ label: 'Only Plain Title', action: TitleOnly, key: '' },
		{ label: 'Only URL', action: UrlOnly, key: '' }
	];

	let selectedIndex = 0;
	let menuDiv = null;

	function showMenu() {
		if (menuDiv) return; // Already showing

		menuDiv = document.createElement('div');
		menuDiv.style.cssText = `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: #2b2b2b;
			border: 2px solid #555;
			border-radius: 8px;
			padding: 10px;
			z-index: 999999;
			box-shadow: 0 4px 20px rgba(0,0,0,0.5);
			font-family: monospace;
			min-width: 300px;
		`;

		const title = document.createElement('div');
		title.textContent = 'Copy Format';
		title.style.cssText = `
			color: #fff;
			font-weight: bold;
			padding: 8px;
			border-bottom: 1px solid #555;
			margin-bottom: 5px;
		`;
		menuDiv.appendChild(title);

		menuItems.forEach((item, index) => {
			const itemDiv = document.createElement('div');
			itemDiv.textContent = `${item.label}${item.key ? ' (Alt+' + item.key + ')' : ''}`;
			itemDiv.style.cssText = `
				padding: 8px 12px;
				color: #ddd;
				cursor: pointer;
				border-radius: 4px;
				margin: 2px 0;
			`;
			itemDiv.dataset.index = index;
			
			itemDiv.onmouseover = () => {
				selectedIndex = index;
				updateSelection();
			};
			
			itemDiv.onclick = () => {
				executeAction(item.action);
			};
			
			menuDiv.appendChild(itemDiv);
		});

		document.body.appendChild(menuDiv);
		updateSelection();
	}

	function updateSelection() {
		if (!menuDiv) return;
		const items = menuDiv.querySelectorAll('div[data-index]');
		items.forEach((item, index) => {
			if (index === selectedIndex) {
				item.style.background = '#0078d4';
				item.style.color = '#fff';
			} else {
				item.style.background = 'transparent';
				item.style.color = '#ddd';
			}
		});
	}

	function hideMenu() {
		if (menuDiv) {
			menuDiv.remove();
			menuDiv = null;
		}
	}

	function executeAction(action) {
		hideMenu();
		highlightCopyComplex(action);
	}

	function handleKeyDown(event) {
		if (!menuDiv) return;

		switch(event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = (selectedIndex + 1) % menuItems.length;
				updateSelection();
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
				updateSelection();
				break;
			case 'Enter':
				event.preventDefault();
				executeAction(menuItems[selectedIndex].action);
				break;
			case 'Escape':
				event.preventDefault();
				hideMenu();
				break;
		}
	}

	return { showMenu, hideMenu, handleKeyDown };
}

function main() {
	
	if (window.top !== window.self) return;

	const copyMenu = createCopyMenu();

	GM_registerMenuCommand("MarkDown Title `[Title](URL)`", () => highlightCopyComplex(MarkDown));
	GM_registerMenuCommand("// Rich Title //", () => highlightCopyComplex(RichTitle));
	GM_registerMenuCommand("Title with URL", () => highlightCopyComplex(TitleUrl));
	GM_registerMenuCommand("Only Plain Title", () => highlightCopyComplex(TitleOnly));

	document.onkeydown = function (event) {
		// Handle menu navigation when menu is open
		copyMenu.handleKeyDown(event);

		// 73 is <i>, 74 is <j>, 75 is <k>, https://www.toptal.com/developers/keycode
		if (event.altKey && event.shiftKey && event.keyCode == 75) { // Alt+Shift+K
			event.preventDefault();
			copyMenu.showMenu();
		}
		if (event.altKey && event.keyCode == 75) { // Alt+K
			highlightCopyComplex(MarkDown);
		}
		if (event.altKey && event.keyCode == 85) { // Alt+U
			highlightCopyComplex(TitleUrl);
		}
	}
}