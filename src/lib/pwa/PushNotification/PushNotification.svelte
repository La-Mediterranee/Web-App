<script lang="ts">
	import { onMount } from 'svelte';

	const applicationServerPublicKey = '<Your Public Key>';

	let isSubscribed: boolean = false;
	let swRegistration: ServiceWorkerRegistration | null = null;

	let pushButton: HTMLButtonElement;
	let disabled: boolean;
	let textContent: string;

	onMount(async () => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			try {
				console.log('Service Worker and Push is supported');

				const swReg = await navigator.serviceWorker.getRegistration();

				console.log('Service Worker is registered', swReg);

				swRegistration = swReg as ServiceWorkerRegistration;

				await initializeUI();
			} catch (error) {
				console.error('Service Worker Error', error);
			}
		} else {
			console.warn('Push messaging is not supported');
			textContent = 'Push Not Supported';
		}
	});

	function urlB64ToUint8Array(base64String: string) {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	async function updateSubscription() {
		disabled = true;
		if (isSubscribed) {
			await unsubscribeUser();
		} else {
			await subscribeUser();
		}
	}

	async function initializeUI() {
		// Set the initial subscription value
		await updateSubscription();

		const subscription = await swRegistration?.pushManager.getSubscription();
		isSubscribed = !(subscription === null);

		if (isSubscribed) {
			console.log('User IS subscribed.');
		} else {
			console.log('User is NOT subscribed.');
		}

		updateBtn();
	}

	function updateBtn() {
		if (Notification.permission === 'denied') {
			textContent = 'Push Messaging Blocked.';
			disabled = true;
			updateSubscriptionOnServer(null);
			return;
		}

		if (isSubscribed) {
			textContent = 'Disable Push Messaging';
		} else {
			textContent = 'Enable Push Messaging';
		}

		disabled = false;
	}

	async function subscribeUser() {
		const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
		try {
			const subscription = await swRegistration?.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: applicationServerKey
			});
			console.log('User is subscribed.');

			updateSubscriptionOnServer(subscription);

			isSubscribed = true;

			updateBtn();
		} catch (err) {
			console.log('Failed to subscribe the user: ', err);
			updateBtn();
		}
	}

	async function unsubscribeUser() {
		try {
			const subscription = await swRegistration?.pushManager.getSubscription();
			if (subscription) {
				await subscription.unsubscribe();
			}
		} catch (error) {
			console.log('Error unsubscribing', error);
		}

		updateSubscriptionOnServer(null);

		console.log('User is unsubscribed.');
		isSubscribed = false;

		updateBtn();
	}

	function updateSubscriptionOnServer(subscription: PushSubscription | null | undefined) {
		// TODO: Send subscription to application server
		const subscriptionJson = document.querySelector('.js-subscription-json') as Element;
		const subscriptionDetails = document.querySelector('.js-subscription-details');

		if (subscription) {
			subscriptionJson.textContent = JSON.stringify(subscription);
			subscriptionDetails?.classList.remove('is-invisible');
		} else {
			subscriptionDetails?.classList.add('is-invisible');
		}
	}
</script>

<button bind:this={pushButton} {disabled} on:click>
	{textContent}
</button>

<style>
	/* your styles go here */
</style>
