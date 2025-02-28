// ==UserScript==
// @name         X Shopee WorkFlow
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动登录，保持专注
// @author       Faye
// @match        *://*.shopee.io/*
// @match        *://*.i.shopee.io/*
// @match        *://*.seatalkweb.com/*
// @match        *://accounts.google.com/*
// @match        https://space.shopee.io/observability/log/*
// @run-at       document-end
// @run-at-note  https://tampermonkey.net/documentation.php#_run_at    watermark、某些页面点击必须要很晚的时机执行，否则需要设置不稳定的 timeout
// @icon         https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/shopee-icon.png
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_common.js
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_shopee_workflow.js
// ==/UserScript==


function site() {
	return window.location.href;
}

function setCookie(cookieName, value, millis) {
	const exdate = new Date();
	exdate.setTime(exdate.getTime() + millis);
	const cookieValue = escape(value) + (millis == null ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = cookieName + "=" + cookieValue;
}

function getCookie(cookieName) {
	var i,
		x,
		y,
		ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == cookieName) {
			return unescape(y);
		}
	}
}

function autoClick() {
	if (/confluence\.shopee\.io\/login\.action/g.test(site())) {
		var loginTimes = getCookie("confluence-login") || 0;
		loginTimes++;
		log("loginTimes: " + loginTimes);
		if (loginTimes < 3) {
			setTimeout(() => {
				const loginHref = document.getElementById("use_idp_button_js").href;
				log(loginHref);
				window.location.href = loginHref;
			}, 500);
		} else {
			alert("当前登录次数: " + loginTimes);
		}
		// cookie只持续1分钟
		setCookie("confluence-login", loginTimes, 1 * 60 * 1000);
	}

	if (/accounts.google.com/g.test(site()) && (/shopee/g.test(site()) || /seatalk/g.test(site()))) {
		// Shopee website auto login google account
		setTimeout(() => {
			const emailElement = document.querySelector('[data-email="zhuo.xu@shopee.com"]');
			emailElement.click();
		}, 500);
	}

	if (/jira\.shopee\.io\/login\.jsp/g.test(site())) {
		loginTimes = getCookie("jira-login") || 0;
		loginTimes++;
		log("loginTimes: " + loginTimes);
		if (loginTimes < 3) {
			setTimeout(() => {
				const loginHref = document.querySelector("#login-form > div.buttons-container.form-footer > div > button").getAttribute("data-authurl");
				log(loginHref);
				window.location.href = loginHref;
			}, 500);
		} else {
			alert("loginTimes: " + loginTimes);
		}
		// cookie只持续1分钟
		setCookie("jira-login", loginTimes, 1 * 60 * 1000);
	}

	if (/package-management/g.test(site())) {
		setTimeout(() => {
			const taskInput = document.getElementsByClassName("ant-input-affix-wrapper")[0];
			// taskInput.innerText = 'z_';
			document.getElementsByClassName("ant-btn ant-btn-primary")[1].click();
		}, 1000);
	}
}

function hackSeaTalk() {
	if (/seatalkweb/g.test(site())) {
		log("start hacking...");
		const main = document.querySelector("#root > div > div.page-container > div.home-default-page.fill.center.loggedIn > div.home-main-window.hbox");
		const notif = document.querySelector(".ant-notification");
		main.style.width = "100%";
		main.style.height = "100%";
		if (notif != null) {
			notif.style.display = 'none';
		}
		// document.body.style.zoom = "80%";
		// document.body.style.transform = 'scale(0.8)';
	}
}

function hackConfluence() {
	if (/confluence/g.test(site())) {
		try {
			document.querySelector("#wm").style.display = "none";
		} catch (error) {
			console.error('An exception occurred:', error);
		}
	}
}

function changeFavicon(newFaviconUrl) {
	var link = document.querySelector('link[rel="icon"]') || document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'icon';
	link.href = newFaviconUrl;
	document.head.appendChild(link);
}

function hackSpaceLogPlatform() {
	if (X.site.startsWith("https://space.shopee.io/observability/log/")) {
		log(`hack space log platform: ${X.site}`);
	}
}

function betterAlertPlatform() {
	const mainT = "Alert Platform";

	const titleMap = {
		"/alert-rules": `Alert Rules`,
		"/alerts": `Alerts List`,
		"/mute-strategies": `Mute Strategies`,
		default: ``
	};

	if (/monitoring.infra.sz.shopee.io/.test(site()) && /enterprise_efficiency/.test(site())) {
		const matchedTitle = Object.keys(titleMap).find(key => site().includes(key));
		const subtitle = titleMap[matchedTitle] || titleMap.default;
		if (subtitle !== "") {
			document.title = `${subtitle} - ${mainT}`;
		}
	}
}

function main() {
	autoClick();
	setTimeout(() => {
		hackSeaTalk();
		hackConfluence();
		hackSpaceLogPlatform();
		betterAlertPlatform();
	}, 1400);
}