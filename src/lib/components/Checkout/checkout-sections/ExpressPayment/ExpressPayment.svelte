<script context="module" lang="ts">
	import type {
		CanMakePaymentResult,
		PaymentRequest,
		PaymentRequestPaymentMethodEvent,
		Stripe,
		StripeElements,
	} from '@stripe/stripe-js';
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';

	import PaymentRequestBtn from './PaymentRequestBtn.svelte';

	const dispatch = createEventDispatcher();

	export let stripe: Stripe | null;
	export let elements: StripeElements;
	export let paymentRequest: PaymentRequest;
	export let canMakePaymentPromise: Promise<CanMakePaymentResult | null>;
	export let loading: boolean;

	async function onPaymentMethod({ detail: e }: CustomEvent<PaymentRequestPaymentMethodEvent>) {
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
	}

	// paymentRequest.on('shippingaddresschange', async e => {
	// 	if (
	// 		e.shippingAddress.country !== 'AT' &&
	// 		(e.shippingAddress.city?.toLocaleLowerCase() !== 'wien' ||
	// 			e.shippingAddress.city?.toLocaleLowerCase() !== 'vienna')
	// 	) {
	// 		e.updateWith({ status: 'invalid_shipping_address' });
	// 	} else {
	// 		e.updateWith({
	// 			status: 'success',
	// 		});

	// 		// Perform server-side request to fetch shipping options
	// 		// const response = await fetch('/calculateShipping', {
	// 		// 	body: JSON.stringify({
	// 		// 		shippingAddress: e.shippingAddress,
	// 		// 	}),
	// 		// });
	// 		// const result = await response.json();
	// 		// e.updateWith({
	// 		// 	status: 'success',
	// 		// 	shippingOptions: result.supportedShippingOptions,
	// 		// });
	// 	}
	// });
</script>

<section>
	<h2>Express-Checkout</h2>

	<div class="container" aria-busy={loading}>
		{#await canMakePaymentPromise}
			<div class="loading-container" out:fade />
		{:then _}
			<PaymentRequestBtn {elements} {paymentRequest} />
		{:catch error}
			{error}
		{/await}
	</div>
</section>

<style lang="scss">
	h2 {
		margin-block-end: 0.1em;
	}

	section {
		margin-bottom: 0.6em;
	}

	.container {
		height: 2.5em;

		display: flex;
		align-items: center;
		position: relative;
		text-align: center;
		justify-content: center;
	}

	.loading-container {
		position: absolute;
		height: 100%;
		width: 100%;
		/* background-color: var(--accent-color, orange); */
		/* background-color: rgb(5 92 208); */
		background-color: rgb(13 104 226);
		overflow: hidden;
		border-radius: 5px;
	}

	.loading-container::after {
		content: ' ';
		position: absolute;
		height: 100%;
		width: 35%;
		z-index: 1;

		left: -45%;
		animation: loading 2s infinite;
		background-image: linear-gradient(
			var(--_direction, to left),
			rgba(251, 251, 251, 0.05),
			rgba(251, 251, 251, 0.3),
			rgba(251, 251, 251, 0.6),
			rgba(251, 251, 251, 0.3),
			rgba(251, 251, 251, 0.05)
		);

		:global([dir='rtl']) & {
			--_direction: to right;

			left: unset;
			right: -45%;
			animation-name: loading-right;
		}

		@media screen and (prefers-reduced-motion: no-preference) {
			animation-duration: 1.3s;
		}
	}

	@keyframes loading {
		0% {
			transform: translateX(45%);
		}
		100% {
			transform: translateX(450%);
		}
	}

	@keyframes loading-right {
		0% {
			transform: translateX(-45%);
		}
		100% {
			transform: translateX(-450%);
		}
	}
</style>
