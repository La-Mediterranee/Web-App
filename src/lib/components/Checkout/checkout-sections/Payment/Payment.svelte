<script context="module" lang="ts">
	import type { StripeElements } from '@stripe/stripe-js';

	export type PaymentMethods = 'credit' | 'sofort' | 'cash';

	type PaymentProcessor =
		| 'amex'
		| 'gPay'
		| 'eps'
		| 'applePay'
		| 'klarna'
		| 'maestro'
		| 'maestroAlt'
		| 'visa'
		| 'visaFlatRounded'
		| 'mastercard'
		| 'mastercardAlt'
		| 'mastercardFlatRounded';

	const logos: Record<PaymentProcessor, string> = Object.create(null, {
		amex: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/american-express.svg',
		},
		gPay: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/google-pay.svg',
		},
		eps: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/eps.svg',
		},
		applePay: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/apple-pay.svg',
		},
		klarna: {
			value: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg?locale=de_at',
		},
		maestro: {
			value: 'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/maestro.svg',
		},
		maestroAlt: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/maestro-alt.svg',
		},
		visa: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/visa.svg',
		},
		visaFlatRounded: {
			value: 'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/visa.svg',
		},
		mastercard: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/mastercard.svg',
		},
		mastercardAlt: {
			value: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/mastercard-alt.svg',
		},
		mastercardFlatRounded: {
			value: 'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/mastercard.svg',
		},
	});

	const TAG = 'CHECKOUT';
</script>

<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';
	import TextField from 'svelty-material/components/TextField/TextField.svelte';

	// import Image from '$lib/components/Image/Image.svelte';

	import TipButton from './TipButton.svelte';
	import PaymentPreProcessor from './PaymentPreProcessor.svelte';
	import PaymentPreProcessorLabel from './PaymentPreProcessorLabel.svelte';

	import RadioButton from '$lib/components/Forms/RadioButton.svelte';
	import CreditCard from '$lib/components/CreditCard/CreditCard.svelte';

	import { slide } from 'svelte/transition';
	import { browser } from '$app/env';

	import type { NamespaceCheckoutTranslation } from '$i18n/i18n-types';
	import { createEventDispatcher } from 'svelte';

	export let elements: StripeElements;
	export let value: number[] = [1];
	export let currentValue = 1;
	export let translations: TranslationFunctions['checkout']['paymentDetails'];

	let form: HTMLFormElement;
	let sum = 0;
	let tip = 'none';
	let paymentMethod: PaymentMethods = 'credit';
	let selected: HTMLFieldSetElement | null = null;
	let checked: 'summary' | 'details' | null = null;

	$: console.debug(TAG, paymentMethod);

	const dispatch = createEventDispatcher();

	const paymentName = 'PaymentMethod';

	const tips = [
		{ value: '5', text: '5%', money: sum * 0.05 },
		{ value: '10', text: '10%', money: sum * 0.05 },
		{ value: '15', text: '15%', money: sum * 0.05 },
		{ value: 'custom', text: 'Benutzerdefiniert', money: undefined },
		{ value: 'none', text: 'Keines', money: undefined },
	];
</script>

<!-- action="./checkout?next=details" -->
<!-- ={e => dispatch('submit', { e, checked })} -->
<form bind:this={form} class="payment-section" method="POST" on:submit|preventDefault>
	<section>
		<!-- <slot name="tip-title" /> -->
		<h3 class="tip-title">
			{translations.tip.title()}
		</h3>
		<fieldset id="tips">
			<legend class="visually-hidden"> <slot name="tip-title" /> </legend>
			<div class="tip-container">
				{#each tips as { value, money, text } (value)}
					<TipButton bind:group={tip} name={'tips'} {value}>
						{text}
						<svelte:fragment slot="money">
							{#if money != null}
								{money}
							{/if}
						</svelte:fragment>
					</TipButton>
				{/each}
			</div>
			<div class="custom-tip-container">
				<TextField disabled={browser && tip !== 'custom'} filled rounded>
					{translations.tip.customTip()}
				</TextField>
			</div>
		</fieldset>
	</section>

	<section>
		<!-- <slot name="payment-title" /> -->
		<h3 class="payment-title">
			{translations.payment.title()}
		</h3>
		<div>
			<fieldset id="payment-method" bind:this={selected}>
				<legend class="visually-hidden">
					<slot name="payment-title" />
				</legend>

				<PaymentPreProcessor>
					<span>
						<RadioButton
							id="credit"
							value="credit"
							name={paymentName}
							bind:group={paymentMethod}
						/>
					</span>
					<div>
						<PaymentPreProcessorLabel for="credit">
							{translations.payment.creditCard.title()}
							<ul aria-hidden="true">
								{#each Array.from( [logos.visa, logos.mastercard, logos.maestroAlt, logos.amex], ) as logo}
									<li>
										<!-- svelte-ignore a11y-missing-attribute -->
										<img src={logo} width={38} height={24} />
									</li>
								{/each}
							</ul>
						</PaymentPreProcessorLabel>
					</div>
				</PaymentPreProcessor>

				{#if paymentMethod === 'credit'}
					<div transition:slide id="card-element" hidden={paymentMethod !== 'credit'}>
						{#if elements}
							<CreditCard {elements}>
								<svelte:fragment slot="number">
									{translations.payment.creditCard.cardNumber()}
								</svelte:fragment><svelte:fragment slot="expiration">
									{translations.payment.creditCard.expiration()}
								</svelte:fragment><svelte:fragment slot="cvc">
									{translations.payment.creditCard.cvc()}
								</svelte:fragment>
							</CreditCard>
						{:else}
							<p>Lädt ...</p>
						{/if}
					</div>
				{/if}

				<PaymentPreProcessor>
					<span>
						<RadioButton
							id="sofort"
							value="sofort"
							name={paymentName}
							bind:group={paymentMethod}
						/>
					</span>
					<div>
						<PaymentPreProcessorLabel for="sofort">
							<!-- <slot name="sofort" /> -->
							{translations.payment.sofort()}
							<img
								src="https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/klarna.svg"
								alt="Klarna Logo"
								width={38}
								height={24}
							/>
						</PaymentPreProcessorLabel>
					</div>
				</PaymentPreProcessor>

				<PaymentPreProcessor>
					<span>
						<RadioButton
							id="cash"
							value="cash"
							name={paymentName}
							bind:group={paymentMethod}
						/>
					</span>
					<div>
						<PaymentPreProcessorLabel for="cash">
							<!-- <slot name="cash" /> -->
							{translations.payment.cash()}
						</PaymentPreProcessorLabel>
					</div>
				</PaymentPreProcessor>
			</fieldset>

			<div class="actions">
				<Button
					type="submit"
					name="summary"
					class="form-elements-color"
					size="large"
					formaction="./checkout?next=2"
					rounded
					on:click={() => ((value = [(currentValue = 2)]), (checked = 'summary'))}
				>
					<!-- <slot name="next" /> -->
					<span style="font-weight: bold; font-size: 1.1em">
						{translations.next()}
					</span>
				</Button>
				<Button
					type="submit"
					name="details"
					formaction="./checkout?prev=0"
					rounded
					on:click={() => ((value = [(currentValue = 0)]), (checked = 'details'))}
				>
					<!-- <slot name="prev" /> -->
					{translations.prev()}
				</Button>
			</div>
		</div>
	</section>
</form>

<style lang="scss" global>
	@use 'variables' as *;

	.payment-section {
		--radio-size: 20px;
		width: 100%;

		div {
			width: 100%;
		}

		[slot*='title'],
		[class*='title'] {
			padding: 0.4em 0;
		}

		section {
			width: 100%;
			margin-bottom: 0.8em;

			&:last-of-type {
				margin: 0;
			}
		}

		#tips,
		fieldset {
			border-radius: 0.5em;
			border: 2px solid;
		}

		#tips {
			padding: 0.6em;
		}

		.tip-container {
			display: flex;
			width: 100%;
			flex-flow: wrap;
		}

		.custom-tip-container {
			position: relative;
			padding-top: 0.6em;
			width: 100%;
		}

		.none {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 100%;
		}

		:global(.payment-preprocessor) {
			div,
			span {
				white-space: nowrap;
				align-items: center;
				display: flex;
			}

			ul {
				display: flex;
				list-style: none;

				li {
					padding: 0 0.2em;
				}
			}
		}

		#card-element {
			display: block;

			// :global(.s-input):not(:last-child) {
			// 	margin-bottom: 0.3em;
			// }
		}

		#card-element {
			padding: 0.65em;
			border-bottom: 2px solid;
			transition: height 1s ease-out;
		}

		.actions {
			width: 100%;
			margin-top: 0.8em;
			text-align: center;
			display: flex;
			flex-direction: row-reverse;
			flex-wrap: wrap;
			align-items: center;

			> :global(*) {
				margin: 0.3em;
			}
		}

		@media (min-width: (map-get($map: $breakpoints, $key: md) + 100px)) {
			#card-element {
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

			.actions {
				width: 100%;
				margin-top: 0.8em;
				display: flex;
				flex-direction: row-reverse;

				> :global(:first-child) {
					justify-self: flex-end;
				}

				> :global(:last-child) {
					justify-self: flex-start;
				}

				> :global(*) {
					margin: 0 0.5em;
				}
			}
		}
	}
</style>
