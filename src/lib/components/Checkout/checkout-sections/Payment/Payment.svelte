<script context="module" lang="ts">
	import type { StripeElements } from '@stripe/stripe-js';

	export type PaymentMethods = 'credit' | 'sofort' | 'cash';

	const logos = {
		amex: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/american-express.svg',
		gPay: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/google-pay.svg',
		eps: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/eps.svg',
		applePay:
			'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/apple-pay.svg',
		klarna: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg?locale=de_at',
		maestro:
			'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/maestro.svg',
		maestroAlt:
			'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/maestro-alt.svg',
		visa: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/visa.svg',
		visaFlatRounded:
			'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/visa.svg',
		mastercard:
			'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/mastercard.svg',
		mastercardAlt:
			'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/mastercard-alt.svg',
		mastercardFlatRounded:
			'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/mastercard.svg',
	} as const;

	const TAG = 'CHECKOUT';
</script>

<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';
	import TextField from 'svelty-material/components/TextField/TextField.svelte';

	// import Image from '$lib/components/Image/Image.svelte';

	import TipButton from './TipButton.svelte';
	import PaymentPreProcessor from './PaymentPreProcessor.svelte';
	import RadioButton from '$lib/components/Forms/RadioButton.svelte';
	import CreditCard from '$lib/components/CreditCard/CreditCard.svelte';

	import { slide } from 'svelte/transition';
	import { browser } from '$app/env';

	export let elements: StripeElements;
	export let value: number[] = [1];
	export let currentValue = 1;

	let form: HTMLFormElement;
	let sum = 0;
	let tip = 'none';
	let paymentMethod: PaymentMethods = 'credit';
	let selected: HTMLFieldSetElement | null = null;
	let checked: 'summary' | 'details' | null = null;

	$: console.debug(TAG, paymentMethod);

	const paymentName = 'Zahlungsmethode';

	function backToOrderDetails() {
		console.debug(TAG, 'checkOrderDetails');

		value = [0];
		currentValue = 0;
	}

	function goToSummary(e: SubmitEvent) {
		console.debug(TAG, 'goToSummary');

		const event = e as SubmitEvent;
		const formData = new FormData(form);
		for (const value of formData.values()) {
			console.log(value);
		}

		value = [1];
		currentValue = 1;
	}

	/**
	 * Because only about 70% of Browser implement
	 * the submitter property we have to add click handlers
	 * to each button to distinguish between them
	 *
	 * @param e - the SubmitEvent (svelte tools has Event on `on:submit` instead of SubmitEvent)
	 */

	function checkNextStep(e: Event) {
		console.debug(TAG, 'checkNextStep');

		if (checked === 'summary') {
			goToSummary(e as SubmitEvent);
		} else {
			backToOrderDetails();
		}

		// const submitter: HTMLButtonElement = (event.submitter as HTMLButtonElement)
		// submitter?.value;
	}

	const tips = [
		{ value: '5', text: '5%', money: sum * 0.05 },
		{ value: '10', text: '10%', money: sum * 0.05 },
		{ value: '15', text: '15%', money: sum * 0.05 },
		{ value: 'custom', text: 'Benutzerdefiniert', money: undefined },
		{ value: 'none', text: 'Keines', money: undefined },
	];
</script>

<!-- action="./checkout?next=details" -->

<form
	bind:this={form}
	action="./checkout?next=2"
	method="POST"
	on:submit|preventDefault={checkNextStep}
>
	<section>
		<h3>Trinkgeld hinzufügen</h3>
		<fieldset id="tips">
			<legend class="visually-hidden"> Trinkgeld Prozent Optionen </legend>
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
				<TextField disabled={browser && tip !== 'custom'} outlined rounded>
					Benutzerdefiniertes Trinkgeld
				</TextField>
			</div>
		</fieldset>
	</section>

	<section>
		<h3>Zahlung</h3>
		<div>
			<fieldset id="payment-method" bind:this={selected}>
				<legend class="visually-hidden">Zahlungmethode</legend>

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
						<label class="processorLabel" for="credit">
							Kreditkarte
							<ul aria-hidden="true">
								{#each Array.from( [logos.visa, logos.mastercard, logos.maestroAlt, logos.amex], ) as logo}
									<li>
										<!-- svelte-ignore a11y-missing-attribute -->
										<img src={logo} width={38} height={24} />
									</li>
								{/each}
							</ul>
						</label>
					</div>
				</PaymentPreProcessor>

				{#if paymentMethod === 'credit'}
					<div transition:slide id="card-element" hidden={paymentMethod !== 'credit'}>
						{#if elements}
							<CreditCard {elements} />
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
						<label class="processorLabel" for="sofort">
							Sofort Überweisung
							<img
								src="https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/klarna.svg"
								alt="Klarna Logo"
								width={38}
								height={24}
							/>
						</label>
					</div>
				</PaymentPreProcessor>

				<PaymentPreProcessor>
					<span>
						<RadioButton
							id="bar"
							value="bar"
							name={paymentName}
							bind:group={paymentMethod}
						/>
					</span>
					<div>
						<label class="processorLabel" for="bar">Barzahlung</label>
					</div>
				</PaymentPreProcessor>
			</fieldset>
			<div class="actions">
				<Button
					type="submit"
					name="summary"
					class="form-elements-color"
					style="font-weight: bold; font-size: 0.95em"
					size="large"
					rounded
					on:click={() => {
						checked = 'summary';
					}}
				>
					Zur Zusammenfassung
				</Button>
				<Button
					type="submit"
					name="details"
					formaction="./checkout?prev=0"
					rounded
					on:click={() => {
						checked = 'details';
					}}
				>
					Zurück zu Lieferdetails
				</Button>
				<!-- formaction="./checkout?prev=summary" -->
			</div>
		</div>
	</section>
</form>

<style lang="scss">
	@use 'variables' as *;

	form {
		--radio-size: 20px;
	}

	form,
	div {
		width: 100%;
	}

	h3 {
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

	.processorLabel {
		word-break: normal;
		align-items: center;
	}

	:global(.payment-processor) {
		display: flex;
		padding: 0.65em;
		cursor: pointer;
		align-items: center;
		justify-content: center;

		div,
		span {
			white-space: nowrap;
			align-items: center;
			display: flex;
		}

		label,
		div {
			width: 100%;
		}

		label {
			cursor: pointer;
			display: inline-flex;
			justify-content: space-between;
			padding-inline-start: 0.75em;
			flex-flow: wrap;
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
		div {
			display: block;
		}

		:global(.s-input):not(:last-child) {
			margin-bottom: 0.3em;
		}
	}

	#card-element {
		padding: 0.65em;
		border-bottom: 2px solid;
		transition: height 1s ease-out;
	}

	// #payment-method {
	// 	> div:first-of-type {
	// 		border-top: 0;
	// 	}

	// 	> div:last-of-type {
	// 		border-bottom: 0;
	// 	}

	// 	// > :global(*) {
	// 	// 	padding: 0.2em 0em;
	// 	// }
	// }

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
</style>
