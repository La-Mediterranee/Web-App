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
		history.pushState({}, '', url);
	}

	function createShipping(totalAmount: number) {
		return [
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
				amount: parseInt(totalAmount * 0.05 + ''),
			},
			{
				id: 'tip-10',
				label: '10% Trinkgeld',
				detail: 'Lieferung in 30-60 Minuten',
				amount: parseInt(totalAmount * 0.1 + ''),
			},
			{
				id: 'tip-15',
				label: '15% Trinkgeld',
				detail: 'Lieferung in 30-60 Minuten',
				amount: parseInt(totalAmount * 0.15 + ''),
			},
		];
	}

	const TAG = 'CHECKOUT';
</script>

<script lang="ts">
	import ExpansionPanel from 'svelty-material/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from 'svelty-material/components/ExpansionPanels/ExpansionPanels.svelte';

	import CartSummary from './CartSummary.svelte';
	import Details from './checkout-sections/Details/Details.svelte';
	import Payment from './checkout-sections/Payment/Payment.svelte';
	import Summary from './checkout-sections/Summary/Summary.svelte';
	import ExpressPayment from './checkout-sections/ExpressPayment/ExpressPayment.svelte';

	import { cart } from '$lib/stores/cart';
	import { panels } from './panels';
	import { getStripeContext } from '$lib/stores/stripe';
	import { geti18nContext, LL } from '$i18n/utils';
	import { getCookie } from '$lib/utils';

	import type { session } from '$app/stores';

	export let user: User | undefined;
	export let value = [0];
	export let currentValue = 0;

	let paymentRequest: PaymentRequest;
	let elements: StripeElements;

	let resolveCanMakePayment: {
		res: (
			value: CanMakePaymentResult | PromiseLike<CanMakePaymentResult | null> | null,
		) => void;
		rej: (reason?: any) => void;
	} = {
		//@ts-ignore
		res: undefined,
		//@ts-ignore
		rej: undefined,
	};

	let canMakePaymentPromise: Promise<CanMakePaymentResult | null> = new Promise((res, rej) => {
		resolveCanMakePayment.res = res;
		resolveCanMakePayment.rej = rej;
	});
	let expressLoading = true;

	const stripe = getStripeContext();
	// const { LL } = geti18nContext();

	$: if ($stripe && $cart.state !== 'Loading') {
		mountElements($stripe);
	}

	$: value = value.length === 0 ? [currentValue] : value;

	async function mountElements(stripe: Stripe) {
		elements = stripe.elements({
			// locale: $session.locale,
			fonts: [
				{
					cssSrc: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;800&display=swap',
				},
			],
		});

		try {
			paymentRequest = createPaymentRequest(
				stripe as Stripe,
				$cart.totalAmount,
				'Bestellung',
				createShipping($cart.totalAmount),
			);
			// Check the availability of the Payment Request API first.
			const canMakePayment = await paymentRequest.canMakePayment();
			canMakePayment !== null
				? resolveCanMakePayment.res(canMakePayment)
				: resolveCanMakePayment.rej('Not supported');
			expressLoading = false;
			console.debug(`can make request:`, canMakePayment);
		} catch (error) {
			resolveCanMakePayment.rej('Not supported');
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

	function backToOrderDetails() {
		console.debug(TAG, 'checkOrderDetails');
		// value = [0];
		// currentValue = 0;
		const url = new URL(window.location.origin + window.location.pathname);
		history.pushState({}, '', url);
	}

	function goToSummary(e: SubmitEvent) {
		console.debug(TAG, 'goToSummary');

		const event = e as SubmitEvent;
		const formData = new FormData(e.currentTarget as HTMLFormElement);
		for (const value of formData.values()) {
			console.log(value);
		}

		// value = [2];
		// currentValue = 2;
		updateQueryinUrl('next', 2);
	}

	/**
	 * Because only about 70% of Browser implement
	 * the submitter property we have to add click handlers
	 * to each button to distinguish between them
	 *
	 * @param event - the CustomEvent with the SubmitEvent and clicked button
	 */
	function checkNextStep(
		event: CustomEvent<{
			e: SubmitEvent & {
				target: EventTarget & HTMLButtonElement;
				currentTarget: EventTarget & HTMLFormElement;
			};
			checked: 'summary' | 'details';
		}>,
	) {
		const { e, checked } = event.detail;
		console.debug(TAG, 'checkNextStep', checked, currentValue);

		const data = new FormData(e.currentTarget);

		// if (checked === 'summary') {
		// 	goToSummary(e);
		// } else {
		// 	backToOrderDetails();
		// }

		currentValue === 2 ? goToSummary(e) : backToOrderDetails();

		// const submitter: HTMLButtonElement = (event.submitter as HTMLButtonElement)
		// submitter?.value;
	}
	function detailsSubmit(e: SubmitEvent) {
		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		value = [1];
		currentValue = 1;
		updateQueryinUrl('next', 1);
	}

	function paymentSubmit(e: SubmitEvent) {
		currentValue === 2 ? goToSummary(e) : backToOrderDetails();

		updateQueryinUrl('prev', currentValue);
	}

	function summarySubmit(e: SubmitEvent) {
		// ={e => dispatch('submit', { e, checked })}
		updateQueryinUrl('prev', currentValue);
	}
</script>

<h1>Checkout</h1>

<div id="checkout">
	<div class="checkout-sections">
		<ExpressPayment
			{elements}
			{paymentRequest}
			{canMakePaymentPromise}
			stripe={$stripe}
			loading={expressLoading}
		/>
		<ExpansionPanels bind:value>
			<ExpansionPanel disabled={panels[0].id !== value[0]}>
				<h2 slot="header">1. {$LL.checkout.deliveryDetails.title()}</h2>
				<Details
					{customer}
					translations={$LL.checkout.deliveryDetails}
					on:submit={detailsSubmit}
				/>
			</ExpansionPanel>
			<ExpansionPanel disabled={panels[1].id !== value[0]}>
				<h2 slot="header">2. {$LL.checkout.paymentDetails.title()}</h2>
				<Payment
					bind:value
					bind:currentValue
					{elements}
					translations={$LL.checkout.paymentDetails}
					on:submit={paymentSubmit}
				/>
			</ExpansionPanel>
			<ExpansionPanel disabled={panels[2].id !== value[0]}>
				<h2 slot="header">3. {$LL.checkout.summary.title()}</h2>
				<Summary
					bind:value
					bind:currentValue
					translations={$LL.checkout.summary}
					on:submit={summarySubmit}
				/>
			</ExpansionPanel>
		</ExpansionPanels>
	</div>
	<CartSummary cart={$cart} total={$cart.displayTotalAmount} quantity={$cart.totalQuantity} />
</div>

<!-- <h3 slot="tip-title">
	{$LL.checkout.paymentDetails.tip.title()}
</h3>
<h3 slot="payment-title">
	{$LL.checkout.paymentDetails.payment.title()}
</h3>
<svelte:fragment slot="credit-card">
	{$LL.checkout.paymentDetails.payment.creditCard.title()}
</svelte:fragment>
<svelte:fragment slot="sofort">
	{$LL.checkout.paymentDetails.payment.sofort()}
</svelte:fragment>
<svelte:fragment slot="cash">
	{$LL.checkout.paymentDetails.payment.cash()}
</svelte:fragment>
<svelte:fragment slot="prev">
	{$LL.checkout.paymentDetails.payment.cash()}
</svelte:fragment>
<svelte:fragment slot="next">
	{$LL.checkout.paymentDetails.payment.cash()}
</svelte:fragment> -->
<style lang="scss" global>
	@use 'variables' as *;
	// @use "mixins" as *;

	h1 {
		text-align: center;
	}

	#checkout {
		--cart-summary-width: 37%;
		--radio-color: #aa9b9b;

		display: grid;
		max-width: 40em;
		padding: min(2%, 1em);
		margin: 0 auto;
		font-size: 1em;
		font-weight: 500;
		color: #fff;

		:global(.s-expansion-panel__content) {
			padding: 0 0.7em 1em;
		}

		:global(div[class~='s-input__slot']) {
			color: #ddd;
		}

		.checkout-sections {
			margin-top: 1em;
			order: 1;
		}

		:global(.cart-summary) {
			order: 0;
		}

		@media screen and (min-width: (map-get($map: $breakpoints, $key: md) + 100px)) {
			padding: 1em;
			max-width: 78em;
			grid-template-columns: 1fr var(--cart-summary-width);

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
