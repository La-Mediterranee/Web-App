import { clearAppBadge } from '../utils';

export function handlePushNotificationClick(sw: ServiceWorkerGlobalScope) {
	sw.addEventListener('notificationclick', e => {
		console.log('[Service Worker] Notification click Received.');
		const { notification, action } = e;

		notification.close();

		if (action !== 'dismiss') {
			// This handles both notification click and 'details' action,
			// because some platforms might not support actions.
			// clients.openWindow(notification.data.href);
			sw.clients.openWindow(new URL(''));
		}

		if (!notification.data.pathname) return;
		const pathname = notification.data.pathname;
		const url = new URL(pathname, self.location.origin).href;

		e.waitUntil(async () => {
			const clientsArr = await sw.clients.matchAll({ type: 'window', includeUncontrolled: true });

			const hadWindowToFocus = clientsArr.some(windowClient =>
				windowClient.url === url ? (windowClient.focus(), true) : false
			);

			if (!hadWindowToFocus) {
				const windowClient = await sw.clients.openWindow(url);
				return windowClient ? windowClient.focus() : null;
			}
		});

		clearAppBadge();
	});

	sw.addEventListener('notificationclose', () => {});
}
