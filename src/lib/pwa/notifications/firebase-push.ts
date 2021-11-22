declare var self: ServiceWorkerGlobalScope;
declare var navigator: ExtendedNavigator;

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage, isSupported } from 'firebase/messaging/sw';

import { setAppBadge } from '../utils';
import { firebaseConfig } from '$lib/utils/constants';

import type { MessagePayload } from 'firebase/messaging';

if (await isSupported()) {
	const firebaseApp = initializeApp(firebaseConfig);
	const messaging = getMessaging(firebaseApp);

	onBackgroundMessage(messaging, handlePushNotification(self));
}

export function handlePushNotification(sw: ServiceWorkerGlobalScope) {
	let messages = 0;

	return (payload: MessagePayload) => {
		console.log('[Service Worker] Push Received.');
		console.log('[Service Worker] Received background message ', payload);
		const { notification, data } = payload;

		if (!notification?.title && !notification?.body) {
			return;
		}

		const title = notification?.title || 'Delivery Update';
		const options: NotificationOptions = {
			body: `${notification?.body}`,
			data: { href: '/users/donald' },
			actions: [
				{ action: 'details', title: 'Details' },
				{ action: 'dismiss', title: 'Dismiss' },
			],
		};

		sw.registration.showNotification(title, options);
		setAppBadge(++messages);
	};
}
