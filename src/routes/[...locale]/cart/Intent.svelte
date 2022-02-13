<script lang="ts">
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';

	import { fetchFromAPI } from '$lib/utils/helper';
	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

	import type {
		PaymentIntent,
		Stripe,
		StripeCardElement,
	} from '@stripe/stripe-js';

	let amount = 0;
	let complete = false;

	let card: HTMLElement;
	let cardElement: StripeCardElement | undefined;
	let paymentIntent: PaymentIntent | undefined;
	let stripe: Stripe | null;

	$: hasPaymentIntent = paymentIntent ? true : false;

	onMount(async () => {
		stripe = await loadStripe(STRIPE_PUBLIC_KEY);
		const elements = stripe?.elements();

		cardElement = elements?.create('card');
		cardElement?.mount(card);
		cardElement?.on('change', e => (complete = e.complete));
	});

	async function createPaymentIntent(_event: Event) {
		const validAmount = Math.min(Math.max(amount, 50), 9999999);
		amount = validAmount;
		paymentIntent = await fetchFromAPI('payments', {
			body: { amount: validAmount },
		});
	}

	async function handleSubmit(_e: Event) {
		if (stripe && paymentIntent?.client_secret) {
			const { paymentIntent: updatedPaymentIntent, error } =
				await stripe.confirmCardPayment(paymentIntent.client_secret, {
					payment_method: {
						card: cardElement!,
					},
				});

			if (error) {
				console.error(error);
				error.payment_intent && (paymentIntent = error.payment_intent);
			} else {
				paymentIntent = updatedPaymentIntent;
			}
		}
	}
</script>

<div>
	<input type="number" disabled={hasPaymentIntent} bind:value={amount} />
	<button
		disabled={amount <= 0}
		hidden={hasPaymentIntent}
		on:click={createPaymentIntent}
	>
		Bereit zu Zahlen {(amount / 100).toFixed(2)}€
	</button>

	<form on:submit|preventDefault={handleSubmit}>
		<div class="elements" bind:this={card} />
		<button> Zahlen </button>
	</form>
</div>

<style>
	/* your styles go here */
</style>
