<script lang="ts">
	import '../app.css';
	import { dev } from '$app/env';
	import { initializeApp, getApps } from '@firebase/app';

	import Firebase from '$lib/Firebase/Firebase.svelte';
	import Stripe from '$lib/components/Stripe/Stripe.svelte';
	import MaterialApp from 'svelte-materialify/src/components/MaterialApp/MaterialAppMin.svelte';

	import { firebaseConfig, GA_MEASUREMENT_ID } from '$utils/constants';

	import type { FirebaseApp } from 'firebase/app';

	const firebase: FirebaseApp | null = !getApps().length ? initializeApp(firebaseConfig) : null;

	function loaded() {
		console.log('gtag');
	}
</script>

<svelte:head>
	{#if !dev}
		<script
			on:load={loaded}
			async
			src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
	{/if}
	<!-- {@html `<script src="/some-script.js"></script>`} -->
</svelte:head>

<Firebase {firebase}>
	<Stripe>
		<MaterialApp theme="custom">
			<slot />
		</MaterialApp>
	</Stripe>
</Firebase>
