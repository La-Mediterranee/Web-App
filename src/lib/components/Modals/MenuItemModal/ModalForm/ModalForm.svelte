<svelte:options immutable />

<script context="module" lang="ts">
	import { mdiInformation } from '@mdi/js';

	import type { MenuItem, Product, Variations } from 'types/product';

	const AmountLabel = 'Menge';
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';
	import Chip from 'svelty-material/components/Chip/Chip.svelte';

	import RadioButton from '$lib/components/Forms/RadioButton.svelte';
	import Checkbox from '$lib/components/Forms/Checkbox.svelte';
	import FormActions from './FormActions.svelte';
	import LL from '$i18n/i18n-svelte';

	import ToppingOptionPrice from './ToppingOption/Price.svelte';
	import ToppingOptionLabel from './ToppingOption/Label.svelte';
	import ToppingOptionImage from './ToppingOption/Image.svelte';
	import ToppingOption from './ToppingOption/ToppingOption.svelte';

	import { formatPrice } from '$lib/stores/cart';

	export let menuitem: MenuItem;
	export let valid: boolean;
	export let quantitiy: number;

	const addToCartBtnText = 'Zum Warenkorb hinzufügen';
</script>

<div class="modal-form-container">
	<form id="product-modal" action="/add-to-cart" on:change on:submit|preventDefault>
		<div class="selection">
			<h1 class="title">Customization</h1>

			<div class="toppings">
				{#each menuitem?.toppings || [] as topping}
					<fieldset id={topping.ID} class="topping">
						<div
							style="display: flex; width: 100%; align-items: center; margin-bottom: .3em;"
						>
							<legend style="flex: 1 1 auto">
								{topping.name}
							</legend>
							{#if topping.qtyMin > 0}
								<!-- <span
								style="padding: 0.3em 0.5em; background: var(--top2); border-radius: 0.4em; flex: 0 0 auto"
							>
								min: {topping.qtyMin}
							</span> -->
								<Chip label>
									min: {topping.qtyMin}
								</Chip>
							{/if}
						</div>

						{#each topping.options as option}
							<ToppingOption>
								<ToppingOptionLabel>
									{#if topping.qtyMin === 1 && topping.qtyMax === 1}
										<RadioButton name={topping.ID} value={option.ID} required />
									{:else}
										<Checkbox name={topping.ID} value={option.ID} />
									{/if}
									<ToppingOptionImage src={'/burger.png'} alt="" />
									<span class="input-label">
										{option.name}
									</span>
									<ToppingOptionPrice ariaLabel={$LL.product.price()}>
										{#if option.price}
											{formatPrice(option.price)}
										{:else}
											<span class="visually-hidden">
												{$LL.product.free()}
											</span>
										{/if}
									</ToppingOptionPrice>
								</ToppingOptionLabel>
								<!-- style="color: var(--accent-color, orange); background-color: white;" -->
								<Button icon type="button" on:click={() => console.log('Hi')}>
									<Icon path={mdiInformation} />
								</Button>
							</ToppingOption>
						{/each}
					</fieldset>
				{/each}
			</div>
		</div>

		<FormActions>
			<div class="amount-container">
				<Button
					size="small"
					class="form-elements-color"
					disabled={quantitiy <= 1 || quantitiy == null}
					fab
					on:click={() => quantitiy--}
				>
					<span style="font-size: 2.8rem; font-weight:400"> - </span>
				</Button>
				<label for="amount" class="visually-hidden">{AmountLabel}</label>
				<input
					id="amount"
					type="number"
					inputmode="numeric"
					min="1"
					max="10"
					bind:value={quantitiy}
				/>
				<Button size="small" class="form-elements-color" fab on:click={() => quantitiy++}>
					<span style="font-size: 2.8rem; font-weight:400"> + </span>
				</Button>
			</div>

			<Button text type="submit" class="form-elements-color" disabled={!valid} rounded>
				<span class="add-to-cart-text">{addToCartBtnText}</span>
			</Button>
		</FormActions>
	</form>
</div>

<style lang="scss">
	.title {
		font-size: 2em;
		margin: 0.6em 0 0.4em;
	}

	.amount-container {
		font-weight: bold;
		color: #fff;
		// margin-bottom: 0.8rem;
		display: flex;
		margin-block-end: 0.4em;
	}

	:global(.topping-item) {
		.info-button {
			margin-left: auto;
		}
	}

	.modal-form-container {
		// flex: 0 1 calc(100% - 3em - var(--aside-width));
		flex: 1 1 100%;
		display: flex;
		flex-direction: column;
	}

	$modalBP: 850px;

	#product-modal {
		--actions-height: 62.5px;
		--s-badge-offset-x: 40px;
		--s-badge-offset-y: 8px;
		// --image-margin: 0 1em;

		// max-width: 42em;
		position: relative;
		display: flex;
		flex-direction: column;
		flex: 1;

		color: #fff;
		accent-color: var(--accent-color, orange);

		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
		}

		.info {
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.selection {
			flex: 1;
			padding: 0.3em 0.8em;
			margin-block-end: 0.5em;
		}

		.toppings {
			// height: 100%;
			flex: 1;
		}

		.topping {
			border: none;
			margin: 1em 0;
			padding: 0.4em 0;
			display: flex;
			flex-wrap: wrap;

			&:last-child {
				margin-bottom: 0;
			}

			legend {
				font-size: 1.5em;
				font-weight: 600;
				flex: 1 1 100%;
			}
		}

		.input-label {
			margin: 0 0.6em;
		}

		.add-to-cart-text {
			color: inherit;
			font-size: min(3.2vw, 0.82rem);
			font-weight: bold;
		}

		#amount {
			width: 2em;
			text-align: center;
			appearance: textfield;
			color: inherit;
		}

		@media screen and (min-width: 340px) {
			.amount-container {
				margin-block-end: 0;
			}
		}

		// $modalBP: 765px;

		@media screen and (min-width: 450px) {
			.add-to-cart-text {
				font-size: 1rem;
			}
		}
	}

	@media screen and (min-width: $modalBP) {
		.modal-form-container {
			flex: 0 1 calc(100% - var(--aside-width));
		}

		#product-modal {
			padding-bottom: 0;
			padding: var(--container-padding);

			.title {
				font-size: 2.5em;
				text-align: center;
			}

			.selection {
				padding: 0;
			}

			// .actions {
			// 	--actions-position: sticky;
			// }
		}
	}
</style>
