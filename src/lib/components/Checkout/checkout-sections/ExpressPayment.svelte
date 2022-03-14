<script context="module" lang="ts">
	import type {
		PaymentRequest,
		Stripe,
		StripeElements,
		StripePaymentRequestButtonElement,
	} from '@stripe/stripe-js';
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let stripe: Stripe | null;
	export let elements: StripeElements | undefined;
	export let paymentRequest: PaymentRequest;

	let paymentRequestButton: StripePaymentRequestButtonElement | undefined;

	onMount(async () => {
		paymentRequestButton = elements?.create('paymentRequestButton', {
			paymentRequest,
			style: {
				paymentRequestButton: {
					theme: 'dark',
				},
			},
		});
		paymentRequestButton?.mount('#payment-request-button');
	});

	paymentRequest.on('paymentmethod', async e => {
		console.debug(e);
		return;
		// Make a call to the server to create a new
		// payment intent and store its client_secret.
		const { error: backendError, clientSecret } = await fetch('/create-payment-intent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				currency: 'eur',
				paymentMethodType: 'card',
			}),
		}).then(r => r.json());

		if (backendError) {
			console.error(backendError.message);
			e.complete('fail');
			return;
		}

		// Confirm the PaymentIntent without handling potential next actions (yet).
		const { paymentIntent, error: confirmError } =
			(await stripe?.confirmCardPayment(
				clientSecret,
				{ payment_method: e.paymentMethod.id },
				{ handleActions: false },
			)) || {};

		if (confirmError) {
			// Report to the browser that the payment failed, prompting it to
			// re-show the payment interface, or show an error message and close
			// the payment interface.
			e.complete('fail');
		} else {
			// Report to the browser that the confirmation was successful, prompting
			// it to close the browser payment method collection interface.
			e.complete('success');
			// Check if the PaymentIntent requires any actions and if so let Stripe.js
			// handle the flow. If using an API version older than "2019-02-11"
			// instead check for: `paymentIntent.status === "requires_source_action"`.
			if (paymentIntent?.status === 'requires_action') {
				// Let Stripe.js handle the rest of the payment flow.
				const { error } = (await stripe?.confirmCardPayment(clientSecret)) || {};
				if (error) {
					// The payment failed -- ask your customer for a new payment method.
				} else {
					// The payment has succeeded.
				}
			} else {
				// The payment has succeeded.
			}
		}
	});

	paymentRequest.on('shippingaddresschange', async e => {
		if (
			e.shippingAddress.country !== 'AT' &&
			(e.shippingAddress.city?.toLocaleLowerCase() !== 'wien' ||
				e.shippingAddress.city?.toLocaleLowerCase() !== 'vienna')
		) {
			e.updateWith({ status: 'invalid_shipping_address' });
		} else {
			e.updateWith({
				status: 'success',
			});

			// Perform server-side request to fetch shipping options
			// const response = await fetch('/calculateShipping', {
			// 	body: JSON.stringify({
			// 		shippingAddress: e.shippingAddress,
			// 	}),
			// });
			// const result = await response.json();
			// e.updateWith({
			// 	status: 'success',
			// 	shippingOptions: result.supportedShippingOptions,
			// });
		}
	});
</script>

<section>
	<h2>Express-Checkout</h2>
	<div id="payment-request-button" />
</section>

<style>
	h2 {
		margin-bottom: 0.3em;
	}

	section {
		margin-bottom: 0.6em;
	}
</style>
