<script context="module" lang="ts">
	import type {
		CanMakePaymentResult,
		PaymentRequest,
		Stripe,
		StripeElement,
		StripeElements,
	} from '@stripe/stripe-js';

	import { createPaymentRequest } from './helper';

	import type { User } from 'firebase/auth';

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
</script>

<script lang="ts">
	import ExpansionPanel from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanels.svelte';

	import { cart } from '$lib/stores/cart';
	import { getStripeContext } from '$lib/utils/helpers';

	import CartSummary from './CartSummary.svelte';
	import Details from './checkout-sections/Details.svelte';
	import Payment from './checkout-sections/Payment.svelte';
	import Summary from './checkout-sections/Summary.svelte';
	import ExpressPayment from './checkout-sections/ExpressPayment.svelte';

	export let user: User;

	let value = [0];
	let currentValue = 0;
	let canMakePayment: CanMakePaymentResult | null = null;
	let paymentRequest: PaymentRequest;
	let elements: StripeElements;

	const stripe = getStripeContext();

	$: if ($stripe) {
		mountElements($stripe);
	}

	$: value = value.length === 0 ? [currentValue] : value;

	async function mountElements(stripe: Stripe) {
		elements = stripe.elements({
			locale: 'de',
			fonts: [
				{
					cssSrc: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;800&display=swap',
				},
			],
		});

		paymentRequest = createPaymentRequest(
			stripe as Stripe,
			cart.totalAmount,
			'Bestellung',
			[
				{
					id: 'free-delivery',
					label: 'Gratis Lieferung',
					detail: 'Lieferung in 30-60 Minuten',
					amount: 0,
				},
				{
					id: 'tip',
					label: 'Trinkgeld',
					detail: 'Trinkgeld',
					amount: cart.totalAmount * 1.05,
				},
			]
		);

		// Check the availability of the Payment Request API first.
		canMakePayment = await paymentRequest.canMakePayment();
		console.debug(`can make request:`, canMakePayment);
	}

	const panels = [
		{
			id: 0,
			header: '1. Lieferdetails',
		},
		{
			id: 1,
			header: '2. Zahlungdetails',
		},
		{
			id: 2,
			header: '3. Zusammenfassung',
		},
	];

	const customer: CustomerInfo = {
		name: user?.displayName || '',
		surname: '',
		address: '',
		postalCode: '',
		city: '',
		country: '',
		email: user?.email || '',
		number: user?.phoneNumber || '',
		tip: 0,
		paymentMehod: '',
	};
</script>

<h1>Checkout</h1>

<div id="checkout">
	<CartSummary
		cart={$cart}
		total={cart.totalAmount}
		quantity={cart.totalQuantity}
	/>
	<div>
		{#if canMakePayment}
			<ExpressPayment stripe={$stripe} {paymentRequest} {elements} />
		{/if}
		<ExpansionPanels bind:value>
			<ExpansionPanel disabled={panels[0].id !== value[0]}>
				<h2 slot="header">{panels[0].header}</h2>
				<Details bind:value bind:currentValue {customer} />
			</ExpansionPanel>
			<ExpansionPanel disabled={panels[1].id !== value[0]}>
				<h2 slot="header">{panels[1].header}</h2>
				<Payment bind:value bind:currentValue {elements} />
			</ExpansionPanel>
			<ExpansionPanel disabled={panels[2].id !== value[0]}>
				<h2 slot="header">{panels[2].header}</h2>
				<Summary bind:value bind:currentValue />
			</ExpansionPanel>
		</ExpansionPanels>
	</div>
</div>

<style lang="scss">
	@use "variables" as *;

	h1 {
		text-align: center;
	}

	#checkout {
		padding: 1em;
		display: block;
		max-width: 40em;
		margin: 0 auto;

		* {
			color: #ddd;
		}

		div {
			margin-top: 1em;
		}

		:global(div[class~='s-input__slot']) {
			color: #ddd;
		}

		@media screen and (min-width: $md + 100px) {
			padding: 3em;
			display: flex;
			flex-direction: row-reverse;
			max-width: 78em;

			div {
				margin-top: 0;
				margin-right: 1em;
			}
		}
	}
</style>
