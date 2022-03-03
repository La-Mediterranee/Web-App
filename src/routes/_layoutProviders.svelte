<script context="module" lang="ts">
	import { dev } from '$app/env';
	import { onMount } from 'svelte';
	import { initializeApp, getApps, getApp } from 'firebase/app';

	import { getGlobal } from '$lib/utils';
	import { firebaseConfig, GA_MEASUREMENT_ID } from '$utils/constants';

	import type { FirebaseApp } from 'firebase/app';

	/**
	 * To enable optional chaining for window properties
	 * I defined window in the global scope. This shouldn't
	 * affect any libraries that checks for window because it
	 * still returns undefined
	 */
	const globals = getGlobal();

	if (typeof window === 'undefined') {
		//@ts-ignore
		globals.window = undefined;
	}

	function loaded() {
		console.log('gtag');
	}
</script>

<script lang="ts">
	import Firebase from '$lib/firebase/Firebase.svelte';
	import Stripe from '$lib/components/Stripe/Stripe.svelte';

	const firebase: FirebaseApp = !getApps()?.length ? initializeApp(firebaseConfig) : getApp();

	onMount(async () => {
		window.dataLayer = window.dataLayer || [];

		function gtag(...args: unknown[]) {
			window.dataLayer.push(args as never);
		}

		gtag('js', new Date());
		gtag('config', GA_MEASUREMENT_ID);
	});
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
	<Stripe>
		<slot />
		<!-- <MaterialApp theme="custom">
		</MaterialApp> -->
	</Stripe>
</Firebase>
