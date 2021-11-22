declare var navigator: ExtendedNavigator;

export function setAppBadge(unread: number) {
	if ('setAppBadge' in navigator) {
		navigator.setAppBadge(unread);
	}
}

export function clearAppBadge() {
	if ('clearAppBadge' in navigator) {
		navigator.clearAppBadge();
	}
}

export function urlB64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export function blobToArrayBuffer(blob: Blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('loadend', (e) => {
			resolve(reader.result);
		});
		reader.addEventListener('error', reject);
		reader.readAsArrayBuffer(blob);
	});
}

export function arrayBufferToBlob(buffer: BlobPart, type: string) {
	return new Blob([buffer], { type: type });
}
