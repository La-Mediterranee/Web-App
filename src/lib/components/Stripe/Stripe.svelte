<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, setContext } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';

	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

	import type { Stripe } from '@stripe/stripe-js';

	const STRIPE_CONTEXT = 'stripe';
	const STRIPE_SCRIPT = `<script defer async src="https://js.stripe.com/v3/">${'<'}/script>`;
</script>

<script lang="ts">
	if (typeof STRIPE_PUBLIC_KEY !== 'string' || typeof STRIPE_PUBLIC_KEY === 'undefined') {
		throw new Error('VITE_STRIPE_PUBLIC_KEY must be added to .env');
	}

	const stripeStore = writable<Stripe | null>(null);

	try {
		setContext(STRIPE_CONTEXT, {
			subscribe: stripeStore.subscribe,
		});

		onMount(async () => {
			try {
				const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
				stripeStore.set(stripe);
				console.info('stripe loaded');
			} catch (error) {
				console.error(error);
			}
		});
	} catch (error) {
		console.error(error);
	}
</script>

<svelte:head>
	{@html STRIPE_SCRIPT}
</svelte:head>

<slot stripe={stripeStore} />
