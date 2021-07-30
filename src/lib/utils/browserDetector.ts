function browserDetector() {
	const browser = (function (agent) {
		switch (true) {
			case agent.indexOf('edge') > -1:
				return 'MS Edge (EdgeHtml)';
			case agent.indexOf('edg') > -1:
				return 'MS Edge Chromium';
			case agent.indexOf('opr') > -1 && !!window.opr:
				return 'opera';
			case agent.indexOf('chrome') > -1 && !!window.chrome:
				return 'chrome';
			case agent.indexOf('trident') > -1:
				return 'Internet Explorer';
			case agent.indexOf('firefox') > -1:
				return 'firefox';
			case agent.indexOf('safari') > -1:
				return 'safari';
			case agent.indexOf('safari') > -1:
				return 'safari';
			default:
				return 'other';
		}
	})(window.navigator.userAgent.toLowerCase());
	return browser;
}
