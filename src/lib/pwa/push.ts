function setBadge() {
	if ('setAppBadge' in navigator) {
		//@ts-ignore
		navigator?.setAppBadge();
		//@ts-ignore
		navigator?.clearAppBadge();
	}
}
