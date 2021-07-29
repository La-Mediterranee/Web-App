<script lang="ts">
	import { loadStripe } from '@stripe/stripe-js/pure';
	import { onMount, setContext } from 'svelte';

	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

	import type { Stripe } from '@stripe/stripe-js';

	const key = 'stripe';

	if (typeof STRIPE_PUBLIC_KEY !== 'string') {
		throw new Error('VITE_STRIPE_PUBLIC_KEY must be added to .env');
	}

	let stripe: Stripe | null = null;

	setContext(key, {
		getStripe: () => stripe,
	});

	onMount(async () => {
		try {
			stripe = await loadStripe(STRIPE_PUBLIC_KEY);
		} catch (error) {
			console.error(error);
		}
	});
</script>

<slot {stripe} />
