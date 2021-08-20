<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { loadStripe } from '@stripe/stripe-js/pure.js';

	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

	import type { Stripe, StripeConstructor } from '@stripe/stripe-js';

	const key = 'stripe';

	if (typeof STRIPE_PUBLIC_KEY !== 'string') {
		throw new Error('VITE_STRIPE_PUBLIC_KEY must be added to .env');
	}

	const stripeStore = writable<Stripe | null>(null);
	const { subscribe, set } = stripeStore;

	setContext(key, {
		subscribe,
	});

	function stripeLoaded(e: Event) {
		const stripe: Stripe = (window.Stripe as StripeConstructor)(
			STRIPE_PUBLIC_KEY
		);
		console.log('stripe loaded');
		set(stripe);
	}

	onMount(async () => {
		try {
			const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
			console.log('stripe loaded');
			set(stripe);
		} catch (error) {
			console.error(error);
		}
	});
</script>

<!-- <svelte:head>
	<script
		defer
		async
		src="https://js.stripe.com/v3/"
		on:load={stripeLoaded}></script>
</svelte:head> -->

<slot stripe={stripeStore} />
