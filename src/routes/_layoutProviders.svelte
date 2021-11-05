<script context="module" lang="ts">
	import { dev } from '$app/env';
	import { initializeApp, getApps, getApp } from 'firebase/app';

	import { firebaseConfig, GA_MEASUREMENT_ID } from '$utils/constants';

	import type { FirebaseApp } from 'firebase/app';

	function loaded() {
		console.log('gtag');
	}
</script>

<script lang="ts">
	import '../app.css';
	import Auth from '$lib/firebase/Auth.svelte';
	import Firebase from '$lib/firebase/Firebase.svelte';
	import Stripe from '$lib/components/Stripe/Stripe.svelte';

	import MaterialApp from 'svelte-material-components/src/components/MaterialApp/MaterialAppMin.svelte';

	const firebase: FirebaseApp = !getApps()?.length ? initializeApp(firebaseConfig) : getApp();
</script>

<svelte:head>
	{#if !dev}
		<script
			defer
			async
			src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
			on:load={loaded}></script>
	{/if}
</svelte:head>

{#if !dev}
	<noscript>
		<iframe
			aria-hidden="true"
			title="Google Tag Manager"
			src={`https://www.googletagmanager.com/ns.html?id=${GA_MEASUREMENT_ID}`}
			height="0"
			width="0"
			style="display:none;visibility:hidden"
		/>
	</noscript>
{/if}

<Firebase {firebase}>
	<Auth>
		<Stripe>
			<MaterialApp theme="custom">
				<slot />
			</MaterialApp>
		</Stripe>
	</Auth>
</Firebase>

<!-- <Firebase {firebase}>
	<Stripe>
		<slot />
	</Stripe>
</Firebase> -->
