<script lang="ts">
	import '../app.css';
	import { dev } from '$app/env';
	import { initializeApp, getApps, getApp } from 'firebase/app';

	import Auth from '$lib/firebase/Auth.svelte';
	import Firebase from '$lib/firebase/Firebase.svelte';
	import Stripe from '$lib/components/Stripe/Stripe.svelte';
	import MaterialApp from 'svelte-materialify/src/components/MaterialApp/MaterialAppMin.svelte';

	import { firebaseConfig, GA_MEASUREMENT_ID } from '$utils/constants';

	import type { FirebaseApp } from 'firebase/app';

	const firebase: FirebaseApp | null = !getApps().length
		? initializeApp(firebaseConfig)
		: getApp();

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

<noscript>
	<iframe
		aria-hidden="true"
		title="Google Tag Manager"
		src="https://www.googletagmanager.com/ns.html?id=GTM-5XN38L2"
		height="0"
		width="0"
		style="display:none;visibility:hidden"
	/>
</noscript>
<Firebase {firebase}>
	<Auth>
		<Stripe>
			<MaterialApp theme="custom">
				<slot />
			</MaterialApp>
		</Stripe>
	</Auth>
</Firebase>
