function setBadge() {
	//@ts-ignore
	if (typeof navigator?.setAppBadge === 'function') {
		//@ts-ignore
		navigator?.setAppBadge();
		//@ts-ignore
		navigator?.clearAppBadge();
	}
}
