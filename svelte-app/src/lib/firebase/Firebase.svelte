<script lang="ts">
	import { browser } from '$app/env';
	import { getApps, getApp } from '@firebase/app';
	import { onMount, createEventDispatcher, setContext } from 'svelte';
	import { getAnalytics, initializeAnalytics } from '@firebase/analytics';

	import type { FirebaseApp } from 'firebase/app';
	import type { Analytics } from 'firebase/analytics';

	export let firebase: FirebaseApp | null = null;

	const dispatch = createEventDispatcher();

	let ready = false;
	let analytics: Analytics;

	// Must be a function to ensure changes after initialization are caught
	setContext('firebase', {
		getFirebase: () => firebase
	});

	if (browser) {
		onMount(() => {
			try {
				firebase = firebase || (getApps().length > 0 ? getApp() : null);
				if (!firebase) {
					throw Error(
						'No firebase app was provided. You must provide an initialized Firebase app or make it available globally.'
					);
				} else {
					// Init analytics
					try {
						analytics = getAnalytics(firebase);
					} catch (error) {
						analytics = initializeAnalytics(firebase);
					}

					// Optional event to set additional config
					dispatch('initializeApp', {
						firebase
					});

					ready = true;
				}
			} catch (error) {
				console.error(error);
			}
		});
	}
</script>

<slot {analytics} />
