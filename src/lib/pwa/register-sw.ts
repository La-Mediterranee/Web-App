import { Workbox } from 'workbox-window';
// import { getMessaging, isSupported, getToken, onMessage, deleteToken } from 'firebase/messaging';

import type { WorkboxLifecycleWaitingEvent } from 'workbox-window';

export async function registerServiceWorker(cb?: Function) {
	const workbox = new Workbox('../service-worker.js');

	const showSkipWaitingPrompt = (event: WorkboxLifecycleWaitingEvent) => {
		// `event.wasWaitingBeforeRegister` will be false if this is
		// the first time the updated service worker is waiting.
		// When `event.wasWaitingBeforeRegister` is true, a previously
		// updated service worker is still waiting.
		// You may want to customize the UI prompt accordingly.

		// Assumes your app has some sort of prompt UI element
		// that a user can either accept or reject.
		if (cb) {
			const prompt = cb({
				onAccept: () => {
					// Assuming the user accepted the update, set up a listener
					// that will reload the page as soon as the previously waiting
					// service worker has taken control.
					workbox.addEventListener('controlling', (event) => {
						window.location.reload();
					});

					workbox.messageSkipWaiting();
				},
				onReject: () => {
					prompt.dismiss();
				},
			});
		}
	};

	// fires when service worker has installed but is waiting to activate.
	workbox.addEventListener('waiting', showSkipWaitingPrompt);

	const registration = await workbox.register();

	registerFirebaseMessaging(registration);

	return registration;
}

async function registerFirebaseMessaging(registration?: ServiceWorkerRegistration) {
	const { getMessaging, isSupported, getToken } = await import('firebase/messaging');

	const messaging = getMessaging();

	const token = await getToken(messaging, {
		serviceWorkerRegistration: registration,
	});
}
