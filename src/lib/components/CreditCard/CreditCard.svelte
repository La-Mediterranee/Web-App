<script context="module" lang="ts">
	import type { StripeElements } from '@stripe/stripe-js';
</script>

<script lang="ts">
	import { onMount } from 'svelte';

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
	filled
	rounded
>
	<slot name="number" />
</StripeTextField>

<div>
	<StripeTextField
		id="card-expiry"
		{elements}
		stripeElement={'cardExpiry'}
		bind:error={cardExpiryError}
		placeholder={false}
		filled
		rounded
	>
		<slot name="expiration" />
	</StripeTextField>

	<StripeTextField
		id="card-cvc"
		{elements}
		stripeElement={'cardCvc'}
		bind:error={cardCvcError}
		placeholder={false}
		filled
		rounded
	>
		<slot name="cvc" />
	</StripeTextField>
</div>

<!-- <option>
	{brand} **** **** **** {last4} expires {exp_month}/{exp_year}
</option> -->
<style lang="scss">
	@use 'variables' as *;

	div {
		display: block;
	}

	// :global(.s-input):not(:last-child) {
	// 	margin-bottom: 0.3em;
	// }

	@media (min-width: map-get($map: $breakpoints, $key: sm)) {
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
