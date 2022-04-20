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
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let elements: StripeElements;
	export let paymentRequest: PaymentRequest;

	let paymentRequestButton: StripePaymentRequestButtonElement;
	let container: HTMLDivElement;

	onMount(() => {
		paymentRequestButton = elements.create('paymentRequestButton', {
			paymentRequest,
			style: {
				paymentRequestButton: {
					theme: 'dark',
				},
			},
		});
		paymentRequestButton.mount(container);

		paymentRequest.on('paymentmethod', e => dispatch('paymentmethod', e));

		return () => {
			paymentRequestButton.unmount();
		};
	});
</script>

<div in:fade bind:this={container} />

<style>
	div {
		width: 100%;
	}
</style>
