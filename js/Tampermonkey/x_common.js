
////////////

// cp -R ~/git/dotfiles/common/Browser/Tampermonkey ~/Projects/Github/_traichu/js
// cd ~/Projects/Github/_traichu/js

////////////

var logBinder = console.log.bind(console);
var isDebug = true;
var debug = isDebug ? console.log.bind(console) : function () { };

function log(message) {
	logBinder("[AllInOne] " + message)
}

const X = {
	get site() {
		return window.location.href;
	},

	get platform() {
		return navigator.userAgentData.platform;
	},
	get isWeekend() {
		const now = new Date();
		const dayOfWeek = now.getDay();
		return dayOfWeek === 0 || dayOfWeek === 6;
	}
}


// setCookie('read-mode', 'true', 30);
function setCookie(cookieName, value, millis) {
	var exdate = new Date();
	exdate.setTime(exdate.getTime() + millis);
	var cookieValue = escape(value) + ((millis == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = cookieName + "=" + cookieValue;
}

function getCookie(cookieName) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == cookieName) {
			return unescape(y);
		}
	}
}

function readModeCss(op) {
	setCookie('read-mode', op, 30 * 24 * 60 * 60 * 1000);
	if (op === "+") {
		document.documentElement.classList.add('read-mode');
	} else {
		document.documentElement.classList.remove('read-mode');
	}
}

function redirectTo(url) {
	window.location.href = url;
}

function showToast(message) {
	const notification = document.createElement('div');
	notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  `;

	notification.innerText = message;
	document.body.appendChild(notification);
	notification.offsetHeight;
	notification.style.opacity = '1';

	setTimeout(() => {
		notification.style.opacity = '0';
	}, 2000);

	setTimeout(() => {
		document.body.removeChild(notification);
	}, 2500);
}

function setZoom(level) {
    document.body.style.zoom = level + "%";
}

function hideSelector(selector) {
	const elements = document.querySelectorAll(selector);
	elements.forEach(element => {
		element.style.display = 'none';
	});
}

function changeFaviconWithRegex(siteRegex, newFaviconUrl) {
	if (siteRegex.test(window.location.href)) {
		var link = document.querySelector('link[rel="icon"]') || document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'icon';
		link.href = newFaviconUrl;
		document.head.appendChild(link);
	}
}

function changeTitleWithRegex(siteRegex, prefix, title) {
	if (siteRegex.test(window.location.href) && !title.startsWith(prefix)) {
		document.title = `${prefix}${title}`;
		log(`hack notion title: ${title}`);
	}
}


// Change the theme color meta tag
// Commonly used for PWA
function changeThemeColor(color) {
	let themeMeta = document.querySelector('meta[name="theme-color"]');
	if (themeMeta) {
		themeMeta.setAttribute('content', color);
	} else {
		themeMeta = document.createElement('meta');
		themeMeta.setAttribute('name', 'theme-color');
		themeMeta.setAttribute('content', color);
		document.head.appendChild(themeMeta);
	}
}