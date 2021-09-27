<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, setContext } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';

	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

	import type { Stripe } from '@stripe/stripe-js';

	const key = 'stripe';

	if (
		typeof STRIPE_PUBLIC_KEY !== 'string' ||
		typeof STRIPE_PUBLIC_KEY === 'undefined'
	) {
		throw new Error('VITE_STRIPE_PUBLIC_KEY must be added to .env');
	}

	const stripeStore = writable<Stripe | null>(null);

	try {
		setContext(key, {
			subscribe: stripeStore.subscribe,
		});

		onMount(async () => {
			try {
				const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
				console.info('stripe loaded', stripe);
				stripeStore.set(stripe);
			} catch (error) {
				console.error(error);
			}
		});
	} catch (error) {}
</script>

<svelte:head>
	<script defer async src="https://js.stripe.com/v3/"></script>
</svelte:head>

<slot stripe={stripeStore} />
