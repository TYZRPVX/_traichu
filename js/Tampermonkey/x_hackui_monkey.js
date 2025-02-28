// ==UserScript==
// @name         X HackUI Monkey
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description
// @author       Body Builder
// @match        *://*.m-team.cc/*
// @match        *://twitter.com/*
// @match        *://*.telegram.org/*
// @match        *://*.oschina.net/*
// @match        *://*.dida365.com/*
// @match        *://*.notion.so/*
// @match        *://bingwallpaper.anerg.com/*
// @match        *://*.cloud.tencent.com/*
// @run-at       document-body
// @run-at-note  https://tampermonkey.net/documentation.php#_run_at
// @icon         https://cdn0.iconfinder.com/data/icons/fitness-95/24/weightlifting-128.png
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      file:///Users/x/git/dotfiles/common/Browser/Tampermonkey/x_common.js
// @require      file:///Users/x/git/dotfiles/common/Browser/Tampermonkey/x_hackui_monkey.js
// @require      file:///C:/git/dotfiles/common/Browser/Tampermonkey/x_common.js
// @require      file:///C:/git/dotfiles/common/Browser/Tampermonkey/x_hackui_monkey.js
// ==/UserScript==

function limitVisitSomeSites() {
	const website = X.site;
	log("iDontRead: " + website);

	function toReadSite() {
		redirectTo("https://weread.qq.com/web/shelf");
	}

	if (/douyin|twitter|oschina/g.test(website)) {
		setTimeout(toReadSite, 2000);
	}
}

function handleMTeam() {

	if (!/kp.m-team.cc/g.test(X.site)) return;
	const ad = () => {
		log("mteam mask: " + X.site);
		hideSelector('.ant-modal-mask');
		hideSelector('.ant-modal-wrap');
	};

	ad();
	function toHabitSite() {
		redirectTo("https://www.notion.so/zhuoxu/Habit-Started-c934d1efd1574dc6a77b93ec8e99859b");
	}

	const habit = () => {
		if (/adult|usercp/g.test(X.site)) {
			log("ban my self ad");
			if (!X.isWeekend) {
				toHabitSite();
			} else {
				changeTitleWithRegex(/adult/g, "M-T", "周末时间到");
			}
		}
	};
	setInterval(habit, 10000);
}


function handleDida() {
	if (/dida365/g.test(X.site)) {
		changeThemeColor("#bcb2e5");
	}
}

function handleBingWallpaper() {

	// Step1: redirect to current day's wallpaper
	// Step2: replace the image with 4k
	// Step3: fullscreen

	const redirectToday = () => {
		if (X.site !== "https://bingwallpaper.anerg.com/") return;
		const todayUi = document.querySelectorAll(".d-inline-block")[0];
		redirectTo(todayUi?.href);
	}

	const replaceImage = () => {
		if (!X.site.startsWith("https://bingwallpaper.anerg.com/detail")) return;
		const image4k = document.querySelector(".btn-warning");
		const imageUrl = image4k?.href;
		const imageUi = document.querySelector(".img-fluid");
		imageUi.src = imageUrl;
	};

	const fullscreenImage = () => {
		if (!X.site.startsWith("https://bingwallpaper.anerg.com/detail")) return;
		const imageUi = document.querySelector(".img-fluid");
		Object.assign(imageUi.style, {
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100vw',
			height: '100vh',
			zIndex: '1000',
			objectFit: 'cover'
		});
	};

	// redirectToday();
	replaceImage();
	fullscreenImage();
}

function handleNotion() {
	const fav = () => {
		if (X.platform === 'macOS') {
			changeTitleWithRegex(/notion.so\/zhuoxu/g, "Playground 🍥 - ", document.title);
		}
	}
	const ad = () => {
		const adDiv = document.querySelector(".autolayout-fill-width").parentElement.parentElement;
		if (adDiv) {
			adDiv.style.display = 'none';
		}
	}
	const scroll = () => {
		var element = document.querySelector("#scroll-properties");
		element.textContent = "";
		log(`remove scroll style`);
	}
	const readMode = () => {
		const cookie = getCookie('read-mode');
		log(`read-mode: ${cookie}`);
		readModeCss(cookie);
	}
	if (/notion.so\/zhuoxu/g.test(X.site)) {
		changeThemeColor("#ffffff");
		readMode();
		scroll();
		setInterval(ad, 10000);
		setInterval(fav, 10000);
	}
}


const urlZoomMap = {
	"cloud.tencent.com": 125,
};
function applyZoomBasedOnUrl(urlZoomMap) {

	for (const [urlPattern, zoomLevel] of Object.entries(urlZoomMap)) {
		if (X.site.includes(urlPattern)) {
			document.body.style.zoom = `${zoomLevel}%`;
			console.log(`Zoom level set to ${zoomLevel}% for ${urlPattern}`);
			break;
		}
	}
}

function main() {

	limitVisitSomeSites();
	const delayHack = () => {
		handleNotion();
		handleDida();
		handleMTeam();
		handleBingWallpaper();
		applyZoomBasedOnUrl(urlZoomMap);
	};
	setTimeout(delayHack, 3000);
}