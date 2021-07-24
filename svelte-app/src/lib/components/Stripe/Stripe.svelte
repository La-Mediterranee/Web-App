<script lang="ts">
	import { loadStripe } from '@stripe/stripe-js';
	import { setContext } from 'svelte';

	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

	import type { Stripe } from '@stripe/stripe-js';

	// ID of the connected stripe account
	// export let stripeAccount: string | undefined = undefined;

	const key = 'stripe';

	if (typeof STRIPE_PUBLIC_KEY !== 'string') {
		throw new Error('VITE_STRIPE_PUBLIC_KEY must be added to .env');
	}

	let stripe: Stripe | null = null;

	setContext(key, {
		getStripe: () => stripe
	});

	loadStripe(STRIPE_PUBLIC_KEY).then((s) => (stripe = stripe));
</script>

<slot {stripe} />
