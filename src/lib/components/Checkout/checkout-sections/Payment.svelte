<script context="module">
	import type { PaymentRequestShippingOption, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';

	export type PaymentMethods = 'credit' | 'sofort' | 'bar';

	const logos = {
		amex: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/american-express.svg',
		gPay: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/google-pay.svg',
		eps: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/eps.svg',
		applePay: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/apple-pay.svg',
		klarna: 'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg?locale=de_at',
		maestro:
			'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/maestro.svg',
		maestroAlt: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/maestro-alt.svg',
		visa: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/visa.svg',
		visaFlatRounded:
			'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/visa.svg',
		mastercard: 'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/mastercard.svg',
		mastercardAlt:
			'https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/mastercard-alt.svg',
		mastercardFlatRounded:
			'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat-rounded/mastercard.svg',
	} as const;

	const TAG = 'CHECKOUT';
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import TextField from 'svelte-material-components/src/components/TextField';
	import Button from 'svelte-material-components/src/components/Button/Button.svelte';

	import Image from '$lib/components/Image/Image.svelte';
	import CreditCard from '$lib/components/CreditCard/CreditCard.svelte';

	export let elements: StripeElements;
	export let value: number[] = [1];
	export let currentValue = 1;

	let form: HTMLFormElement;
	let sum = 0;
	let tip = 'none';
	let mounted = false;
	let paymentMethod: PaymentMethods = 'credit';
	let selected: HTMLFieldSetElement | null = null;
	let checked: 'summary' | 'details' | null = null;

	const name = 'Zahlungsmethode';

	onMount(() => {
		mounted = true;
	});

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
</script>

<form bind:this={form} action="/checkout?section=details" method="POST" on:submit|preventDefault={checkNextStep}>
	<section>
		<h3>Trinkgeld hinzufügen</h3>
		<fieldset id="tips">
			<legend class="visually-hidden"> Trinkgeld Prozent Optionen </legend>
			<div class="tip-container">
				<div class="tip">
					<label for="tip-5">5%</label>
					<input bind:group={tip} id="tip-5" type="radio" class="visually-hidden-radio" value="5" />
					<div>{sum * 0.05}</div>
					<div class="checked" />
				</div>
				<div class="tip">
					<label for="tip-10">10%</label>
					<input bind:group={tip} id="tip-10" type="radio" class="visually-hidden-radio" value="10" />
					<div>{sum * 0.1}</div>
					<div class="checked" />
				</div>
				<div class="tip">
					<label for="tip-15">15%</label>
					<input bind:group={tip} id="tip-15" type="radio" class="visually-hidden-radio" value="15" />
					<div>{sum * 0.15}</div>
					<div class="checked" />
				</div>
				<div class="tip">
					<label for="no-tip"> <span> Keines </span> </label>
					<input
						bind:group={tip}
						id="no-tip"
						type="radio"
						class="visually-hidden-radio"
						value="none"
						checked
					/>
					<div class="checked" />
				</div>
			</div>
			<div class="custom-tip-container">
				<TextField outlined rounded>Benutzerdefiniertes Trinkgeld</TextField>
			</div>
		</fieldset>
	</section>

	<section>
		<h3>Zahlung</h3>
		<div>
			<fieldset id="payment-method" bind:this={selected}>
				<legend class="visually-hidden">Zahlungmethode</legend>

				<div class="payment-processor">
					<span>
						<input bind:group={paymentMethod} type="radio" id="credit" value="credit" {name} />
					</span>
					<div>
						<label for="credit">Kreditkarte</label>
						<ul>
							{#each Array.from([logos.visa, logos.mastercard, logos.maestroAlt, logos.amex]) as logo}
								<li>
									<Image src={logo} width={38} height={24} />
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<div id="card-element" hidden={paymentMethod !== 'credit'}>
					{#if elements}
						<CreditCard {elements} />
					{:else}
						<p>Lädt ...</p>
					{/if}
				</div>

				<div class="payment-processor">
					<span>
						<input bind:group={paymentMethod} type="radio" id="sofort" value="sofort" {name} />
					</span>
					<div>
						<label for="sofort">Sofort Überweisung</label>
						<Image
							src="https://raw.githubusercontent.com/datatrans/payment-logos/master/assets/logos/sofort.svg"
							alt="Klarna Logo"
							width={38}
							height={24}
						/>
					</div>
				</div>

				<div class="payment-processor">
					<span>
						<input bind:group={paymentMethod} type="radio" id="bar" value="bar" {name} />
					</span>
					<div>
						<label for="bar">Zahlung bei Abholung/Lieferung</label>
					</div>
				</div>
			</fieldset>
			<div class="actions">
				<Button
					type="submit"
					name="summary"
					class="form-elements-color"
					rounded
					on:click={() => {
						checked = 'summary';
					}}
				>
					Weiter zur Zusammenfassung
				</Button>
				<Button
					type="submit"
					name="details"
					formaction="/checkout?section=summary"
					rounded
					on:click={() => {
						checked = 'details';
					}}
				>
					Zurück zu den Lieferdetails
				</Button>
			</div>
		</div>
	</section>
</form>

<style lang="scss">
	@use "variables" as *;

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
	}

	.custom-tip-container {
		position: relative;
		padding-top: 0.6em;
		width: 100%;
	}

	.tip {
		position: relative;
		text-align: center;
		border: 2px solid;
		padding: 0.5em 0.4em;
		border-left-width: 0;

		span {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 100%;
		}

		input {
			cursor: pointer;

			&:checked {
				~ .checked {
					border: 3px solid #fb8c00;
				}
			}
		}

		&:first-child {
			border-left-width: 2px;
			border-top-left-radius: 0.45em;
			border-bottom-left-radius: 0.45em;

			.checked {
				border-top-left-radius: 0.3em;
				border-bottom-left-radius: 0.3em;
			}
		}

		&:last-child {
			border-top-right-radius: 0.45em;
			border-bottom-right-radius: 0.45em;

			.checked {
				border-top-right-radius: 0.3em;
				border-bottom-right-radius: 0.3em;
			}
		}
	}

	.visually-hidden-radio,
	.checked {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.visually-hidden-radio {
		opacity: 0;
		z-index: 1;
	}

	.payment-processor {
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

		span {
			padding-right: 0.75em;
		}

		label,
		div {
			width: 100%;
		}

		label {
			cursor: pointer;
			display: table-cell;
		}

		ul {
			display: flex;
			list-style: none;

			li {
				padding: 0 0.2em;
			}
		}

		input {
			color: rgb(170, 155, 155);
			// border: 2px solid;
			// color: rgba(41, 34, 34, 0.4);
			border: 3px solid;
			width: 18px;
			height: 18px;
			transition: all 0.2s ease-in-out;
			border-radius: 43%;

			appearance: none;
			-webkit-font-smoothing: inherit;

			&:checked {
				border-color: #fb8c00;
				border-width: 9px;
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

	#payment-method {
		> div:first-of-type {
			border-top: 0;
		}

		> div:last-of-type {
			border-bottom: 0;
		}

		> div {
			padding: 0.65em;
			border-bottom: 2px solid;
			transition: height 1s ease-out;
		}

		> :global(*) {
			padding: 0.2em 0em;
		}
	}

	.actions {
		width: 100%;
		margin-top: 0.8em;
		text-align: center;
		display: flex;
		flex-direction: row-reverse;

		> :global(*) {
			margin: 0.3em;
		}
	}

	@media (min-width: map-get($map: $breakpoints, $key: md) + 100px) {
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
