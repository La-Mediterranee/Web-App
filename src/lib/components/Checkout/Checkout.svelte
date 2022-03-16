<script context="module" lang="ts">
	import { createPaymentRequest } from './helper';

	import type {
		CanMakePaymentResult,
		PaymentRequest,
		Stripe,
		StripeElements,
	} from '@stripe/stripe-js';
	import type { User } from 'firebase/auth';
	import type { CustomerInfo } from 'types/customer';

	export function updateQueryinUrl(query: string, value: number) {
		const url = new URL(window.location.origin + window.location.pathname);
		url.searchParams.set(query, '' + value);
		window.history.pushState({}, '', url);
	}
</script>

<script lang="ts">
	import ExpansionPanel from 'svelty-material/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from 'svelty-material/components/ExpansionPanels/ExpansionPanels.svelte';

	import CartSummary from './CartSummary.svelte';
	import Details from './checkout-sections/Details.svelte';
	import Payment from './checkout-sections/Payment/Payment.svelte';
	import Summary from './checkout-sections/Summary.svelte';
	import ExpressPayment from './checkout-sections/ExpressPayment.svelte';

	import { cart } from '$lib/stores/cart';
	import { getStripeContext } from '$lib/utils';
	import { onMount } from 'svelte';
	import { panels } from './panels';

	export let user: User | undefined;
	export let value = [0];
	export let currentValue = 0;

	let canMakePayment: CanMakePaymentResult | null = null;
	let paymentRequest: PaymentRequest;
	let elements: StripeElements;

	const stripe = getStripeContext();

	$: if ($stripe && $cart.state !== 'Loading') {
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

		try {
			paymentRequest = createPaymentRequest(
				stripe as Stripe,
				$cart.cart.totalAmount,
				'Bestellung',
				[
					{
						id: 'no-tip',
						label: 'Kein Trinkgeld',
						detail: 'Lieferung in 30-60 Minuten',
						amount: 0,
					},
					{
						id: 'tip-5',
						label: '5% Trinkgeld',
						detail: 'Lieferung in 30-60 Minuten',
						amount: parseInt($cart.cart.totalAmount * 0.05 + ''),
					},
					{
						id: 'tip-10',
						label: '10% Trinkgeld',
						detail: 'Lieferung in 30-60 Minuten',
						amount: parseInt($cart.cart.totalAmount * 0.1 + ''),
					},
					{
						id: 'tip-15',
						label: '15% Trinkgeld',
						detail: 'Lieferung in 30-60 Minuten',
						amount: parseInt($cart.cart.totalAmount * 0.15 + ''),
					},
				],
			);
			// Check the availability of the Payment Request API first.
			canMakePayment = await paymentRequest.canMakePayment();

			console.debug(`can make request:`, canMakePayment);
		} catch (error) {
			console.error(error);
		}
	}

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
	<div class="checkout-sections">
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
	<CartSummary
		cart={$cart.cart}
		total={$cart.cart.displayTotalAmount}
		quantity={$cart.cart.totalQuantity}
	/>
</div>

<style lang="scss" global>
	@use 'variables' as *;
	// @use "mixins" as *;

	h1 {
		text-align: center;
	}

	#checkout {
		--cart-summary-width: 37%;
		--radio-color: #aa9b9b;

		display: flex;
		flex-wrap: wrap;
		max-width: 40em;
		padding: min(2%, 1em);
		margin: 0 auto;
		font-size: 1em;
		font-weight: 500;
		color: #fff;

		:global(.s-expansion-panel__content) {
			padding: 0 0.7em 1em;
		}

		> div {
			margin-top: 1em;
		}

		:global(div[class~='s-input__slot']) {
			color: #ddd;
		}

		.checkout-sections {
			order: 1;
			flex: 1 0 calc(100% - var(--cart-summary-width));
		}

		:global(.cart-summary) {
			order: 0;
		}

		// @include respond-to(md) {
		// }

		@media screen and (min-width: (map-get($map: $breakpoints, $key: md) + 100px)) {
			padding: 1em;
			max-width: 78em;
			flex-wrap: nowrap;

			.checkout-sections {
				order: 0;
				padding-inline-end: 1em;
			}

			:global(.cart-summary) {
				order: 1;
			}

			> div {
				margin-top: 0;
			}
		}
	}
</style>
