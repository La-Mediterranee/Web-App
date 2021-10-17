function handlePushNotifications(sw: ServiceWorkerGlobalScope) {
	let messages = 0;
	sw.addEventListener('push', (e) => {
		const info = e.data?.json();
		const title = 'Push Notification';
		const options: NotificationOptions = {
			body: `${e.data?.text()}`,
			data: { href: '/users/donald' },
			actions: [
				{ action: 'details', title: 'Details' },
				{ action: 'dismiss', title: 'Dismiss' },
			],
		};

		e.waitUntil(sw.registration.showNotification(title, options));
		setAppBadge(++messages);
	});
}

function handlePushNotificationClick(sw: ServiceWorkerGlobalScope) {
	sw.addEventListener('notificationclick', (e) => {
		const notification = e.notification;
		const action = e.action;

		if (action === 'dismiss') {
			notification.close();
		} else {
			// This handles both notification click and 'details' action,
			// because some platforms might not support actions.
			// clients.openWindow(notification.data.href);
			notification.close();
		}

		clearAppBadge();
	});
}

function setAppBadge(unread: number) {
	if ('setAppBadge' in navigator) {
		//@ts-ignore
		navigator.setAppBadge(unread);
	}
}

function clearAppBadge() {
	if ('clearAppBadge' in navigator) {
		//@ts-ignore
		navigator.clearAppBadge();
	}
}
