<script lang="ts">
	import { browser } from '$app/env';
	import { onMount, createEventDispatcher, setContext } from 'svelte';

	import type { FirebaseApp } from 'firebase/app';
	import type { Analytics } from 'firebase/analytics';

	export let firebase: FirebaseApp | null = null;

	if (!firebase) {
		throw Error(
			'No firebase app was provided. You must provide an initialized Firebase app or make it available globally.'
		);
	}

	const dispatch = createEventDispatcher();

	let ready = false;
	let analytics: Analytics;

	// Must be a function to ensure changes after initialization are caught
	setContext('firebase', {
		getFirebase: () => firebase
	});

	onMount(() => {
		// decided not to use Firebase Analytics and use the standalone google analytics because it can be used offline thanks to workbox

		// Optional event to set additional config
		dispatch('initializeApp', {
			firebase
		});

		ready = true;
	});
</script>

<slot {analytics} />
