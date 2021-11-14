import { setAppBadge } from '../utils';
import { handlePushNotificationClick } from './click';
import { handleSubscriptionChange } from './subscription_change';

export function handlePushNotifications(sw: ServiceWorkerGlobalScope) {
	let messages = 0;

	sw.addEventListener('push', (e) => {
		console.log('[Service Worker] Push Received.');

		const info = e.data?.json();
		const title = 'Push Notification';
		const options: NotificationOptions = {
			body: `${e.data?.json()}`,
			data: { href: '/users/donald' },
			actions: [
				{ action: 'details', title: 'Details' },
				{ action: 'dismiss', title: 'Dismiss' },
			],
		};

		e.waitUntil(sw.registration.showNotification(title, options));
		setAppBadge(++messages);
	});

	handleSubscriptionChange(sw);
	handlePushNotificationClick(sw);
}

// export function handlePushNotificationClick(sw: ServiceWorkerGlobalScope) {
// 	sw.addEventListener('notificationclick', (e) => {
// 		console.log('[Service Worker] Notification click Received.');
// 		const notification = e.notification;
// 		const action = e.action;

// 		if (action === 'dismiss') {
// 			notification.close();
// 		} else {
// 			// This handles both notification click and 'details' action,
// 			// because some platforms might not support actions.
// 			// clients.openWindow(notification.data.href);
// 			notification.close();
// 			sw.clients.openWindow(new URL(''));
// 		}

// 		clearAppBadge();
// 	});
// }

// export function handleSubscriptionChange(sw: ServiceWorkerGlobalScope) {
// 	const applicationServerPublicKey = '';
// 	sw.addEventListener('pushsubscriptionchange', function (event) {
// 		console.log("[Service Worker]: 'pushsubscriptionchange' event fired.");
// 		const e = event as PushSubscriptionChangeEvent;
// 		console.log("[Service Worker]: 'pushsubscriptionchange' event fired.");
// 		const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
// 		e.waitUntil(
// 			sw.registration.pushManager
// 				.subscribe({
// 					userVisibleOnly: true,
// 					applicationServerKey: applicationServerKey,
// 				})
// 				.then(function (newSubscription) {
// 					// TODO: Send to application server
// 					console.log('[Service Worker] New subscription: ', newSubscription);
// 				})
// 		);
// 	});
// }
