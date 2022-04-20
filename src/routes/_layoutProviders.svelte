<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { onMount } from 'svelte';
	import { initializeApp, getApps, getApp } from 'firebase/app';

	import { init } from '@sentry/browser';
	import { BrowserTracing } from '@sentry/tracing';

	import { getGlobal } from '$lib/utils';
	import { firebaseConfig, GA_MEASUREMENT_ID, SENTRY_DNS } from '$utils/constants';

	import type { FirebaseApp } from 'firebase/app';
	import type { BrowserOptions } from '@sentry/browser';

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

	if (!dev && browser) {
		const sentryConfig: BrowserOptions = dev
			? {
					dsn: SENTRY_DNS,
					integrations: [new BrowserTracing()],
					// Set tracesSampleRate to 1.0 to capture 100%
					// of transactions for performance monitoring.
					// We recommend adjusting this value in production
					tracesSampleRate: 1.0,
					debug: true,
					environment: 'dev',
					attachStacktrace: true,
			  }
			: {
					dsn: SENTRY_DNS,
					integrations: [new BrowserTracing()],
					environment: 'prod',
			  };

		init(sentryConfig);
	}

	function loaded() {
		console.log('gtag');
	}
</script>

<script lang="ts">
	import Firebase from '$lib/firebase/Firebase.svelte';
	import Stripe from '$lib/components/Stripe/Stripe.svelte';
	import { setAnimationsContext } from '$lib/stores/animations';

	const firebase: FirebaseApp = !getApps()?.length ? initializeApp(firebaseConfig) : getApp();

	setAnimationsContext();

	onMount(async () => {
		window.dataLayer = window.dataLayer || [];

		function gtag(...args: unknown[]) {
			window.dataLayer.push(args);
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
