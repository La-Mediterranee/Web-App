import { getContext, onMount, setContext } from 'svelte';

import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { type Readable, readable } from 'svelte/store';
import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

const STRIPE_CONTEXT = Symbol('stripe');

export function setStripeContext() {
	if (typeof STRIPE_PUBLIC_KEY !== 'string' || typeof STRIPE_PUBLIC_KEY === 'undefined') {
		throw new Error('VITE_STRIPE_PUBLIC_KEY must be added to .env');
	}

	const stripe = readable<Stripe | null>(null, set => {
		onMount(async () => {
			console.log('stripe mounted');
			try {
				set(await loadStripe(STRIPE_PUBLIC_KEY));
				console.log('stripe loaded');
			} catch (error) {
				console.error(error);
			}
		});
	});

	setContext(STRIPE_CONTEXT, stripe);

	// return stripe;
}

export type StripeStore = Readable<Stripe | null>;

export function getStripeContext() {
	return getContext<StripeStore>(STRIPE_CONTEXT);
}
