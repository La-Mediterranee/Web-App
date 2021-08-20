<script context="module">
	import type {
		Stripe,
		StripeCardCvcElement,
		StripeCardExpiryElement,
		StripeCardNumberElement,
		StripeElements,
	} from '@stripe/stripe-js';
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import CreditCvc from './CreditCVC.svelte';
	import CreditExpiry from './CreditExpiry.svelte';
	import CreditNumber from './CreditNumber.svelte';
	import StripeTextField from './StripeTextField.svelte';

	// export let stripe: Stripe;
	export let elements: StripeElements;

	let cardNumberError: boolean;
	let cardExpiryError: boolean;
	let cardCvcError: boolean;

	// const { brand, last4, exp_month, exp_year } = card;
</script>

<StripeTextField
	id="card-number"
	{elements}
	stripeElement={'cardNumber'}
	bind:error={cardNumberError}
	iconStyle="solid"
	placeholder={false}
	rounded
	outlined
>
	Kartennummer
</StripeTextField>

<div>
	<StripeTextField
		id="card-expiry"
		{elements}
		stripeElement={'cardExpiry'}
		bind:error={cardNumberError}
		placeholder={false}
		outlined
		rounded
	>
		MM/JJ
	</StripeTextField>

	<StripeTextField
		id="card-cvc"
		{elements}
		stripeElement={'cardCvc'}
		bind:error={cardNumberError}
		placeholder={false}
		outlined
		rounded
	>
		Prüfzahl
	</StripeTextField>
</div>

<!-- <option>
	{brand} **** **** **** {last4} expires {exp_month}/{exp_year}
</option> -->
<style lang="scss">
	@use "variables.scss" as *;

	div {
		display: block;
	}

	:global(.s-input):not(:last-child) {
		margin-bottom: 0.3em;
	}

	@media (min-width: $sm) {
		div {
			display: flex;
			flex: 1 0 50%;

			> :global(*) {
				&:first-child {
					padding-right: 0.3em;
				}

				&:last-child {
					padding-left: 0.3em;
				}
			}
		}
	}
</style>
