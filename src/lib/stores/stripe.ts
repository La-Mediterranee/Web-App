import { onMount, getContext, setContext } from 'svelte';

import { loadStripe } from '@stripe/stripe-js';
import { type Readable, readable } from 'svelte/store';
import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

import type { Stripe } from '@stripe/stripe-js';

const STRIPE_CONTEXT = Symbol('Stripe');

export function setStripeContext() {
	if (typeof STRIPE_PUBLIC_KEY !== 'string' || typeof STRIPE_PUBLIC_KEY === 'undefined') {
		throw new Error('VITE_STRIPE_PUBLIC_KEY must be added to .env');
	}

	const stripe = readable<Stripe | null>(null, set => {
		onMount(async () => {
			try {
				set(await loadStripe(STRIPE_PUBLIC_KEY));
			} catch (error) {
				console.error(error);
			}
		});
	});

	setContext(STRIPE_CONTEXT, stripe);

	return stripe;
}

export type StripeStore = Readable<Stripe | null>;

export function getStripeContext() {
	return getContext<StripeStore>(STRIPE_CONTEXT);
}
