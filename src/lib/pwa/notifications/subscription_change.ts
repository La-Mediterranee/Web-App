/* eslint-disable no-undef */
import { urlB64ToUint8Array } from '../utils';

export function handleSubscriptionChange(sw: ServiceWorkerGlobalScope) {
	const applicationServerPublicKey = '';
	sw.addEventListener('pushsubscriptionchange', function (event) {
		console.log("[Service Worker]: 'pushsubscriptionchange' event fired.");
		const e = event as PushSubscriptionChangeEvent;
		console.log("[Service Worker]: 'pushsubscriptionchange' event fired.");
		const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
		e.waitUntil(
			sw.registration.pushManager
				.subscribe({
					userVisibleOnly: true,
					applicationServerKey: applicationServerKey,
				})
				.then(function (newSubscription) {
					// TODO: Send to application server
					console.log('[Service Worker] New subscription: ', newSubscription);
				})
		);
	});
}
