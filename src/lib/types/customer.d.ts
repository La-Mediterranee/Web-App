import type { StripeElement } from '@stripe/stripe-js';

export interface CustomerInfo {
	name: string;
	surname: string;
	address: string;
	postalCode: string;
	city: string;
	country: string;
	email: string;
	number: string;
	tip: 0;
	paymentMehod: string | StripeElement;
}
