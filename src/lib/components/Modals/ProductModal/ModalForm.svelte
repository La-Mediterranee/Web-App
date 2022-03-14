<svelte:options immutable />

<script context="module" lang="ts">
	import { mdiInformation } from '@mdi/js';

	import type { Product, Variations } from 'types/product';
	import type { AddToCart } from './ProductModal.svelte';

	const AmountLabel = 'Menge';
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import RadioButton from '$lib/components/Forms/RadioButton.svelte';
	import Checkbox from '$lib/components/Forms/Checkbox.svelte';

	export let product: Product;
	export let valid: boolean;
	export let quantitiy: number;
	export let addToCart: AddToCart;

	const addToCartBtnText = 'Zum Warenkorb hinzufügen';
</script>

<form
	id="product-modal"
	action="/add-to-cart"
	on:change={e => (valid = e.currentTarget.checkValidity())}
	on:submit|preventDefault={e => addToCart(e, product.toppings)}
>
	<div class="selection">
		<h1 class="title">Customization</h1>

		<div class="toppings">
			{#each product.toppings || [] as topping}
				<fieldset class="topping">
					<legend>{topping.name}</legend>

					{#each topping.options as option}
						{@const id = `${topping.ID}-${option.ID}`.toLowerCase()}
						<div class="topping-item">
							<label for={id}>
								<!-- {#if topping.qtyMin === 1 && topping.qtyMax === 1} -->
								<!-- because qtyMax can only be one -->
								{#if (topping.qtyMax & topping.qtyMin) | topping.qtyMin}
									<RadioButton
										{id}
										name={topping.name}
										value={option.ID}
										required
									/>
								{:else}
									<Checkbox
										{id}
										name={topping.name}
										value={option.ID}
										required={topping.qtyMin !== 0}
									/>
								{/if}
								<img width="70" src="/burger.png" alt="" role="presentation" />
								<span class="input-label">
									{option.name}
								</span>
							</label>
							<!-- style="color: var(--accent-color, orange); background-color: white;" -->
							<Button icon type="button" on:click={() => console.log('Hi')}>
								<Icon path={mdiInformation} />
							</Button>
						</div>
					{/each}
				</fieldset>
			{/each}
			{#each ['mama', 'dsd'] || [] as topping}
				<fieldset class="topping">
					<legend>{topping}</legend>

					{#each ['Kraken', 'Sasquatch', 'Mothman'] as item}
						{@const id = `${topping}-${item}`.toLowerCase()}
						<div class="topping-item">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label>
								<RadioButton {id} name={topping} value={item} required />
								<img width="70" src="/burger.png" alt="" role="presentation" />
								<span class="input-label">
									{item}
								</span>
							</label>
							<!-- style="color: var(--accent-color, orange); background-color: white;" -->
							<Button icon type="button" on:click={() => console.log('Hi')}>
								<Icon path={mdiInformation} />
							</Button>
						</div>
					{/each}
				</fieldset>
			{/each}
		</div>
	</div>

	<div class="actions">
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
	</div>
</form>

<style lang="scss">
	.title {
		font-size: 2em;
		margin: 0.6em 0 0.4em;
	}

	.price {
		font-size: 1.5em;
		font-weight: 500;
		padding-inline-start: 0.2em;
	}

	.amount-container {
		font-weight: bold;
		color: #fff;
		// margin-bottom: 0.8rem;
		display: flex;
	}

	#product-modal {
		--actions-height: 62.5px;

		// max-width: 42em;
		display: flex;
		flex-direction: column;
		position: relative;

		flex: 0 0 calc(100% - var(--aside-width));

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

		.topping-item {
			display: flex;
			align-items: center;
			// padding: 0 0.6em;
			flex: 1 1 50%;

			&:hover {
				background: rgb(99, 165, 209);
				border-radius: 0.5em;
			}

			.info-button {
				margin-left: auto;
			}

			img {
				margin: 0 1em;
			}

			label {
				display: flex;
				align-items: center;
				cursor: pointer;

				width: 100%;
				height: 100%;
				font-size: 1.2em;
				padding: 0.6em 0;
				padding-inline-start: 0.5em;
			}
		}

		.add-to-cart-text {
			color: inherit;
			font-size: min(3.2vw, 0.82rem);
			font-weight: bold;
		}

		.actions {
			// height: var(--actions-height);

			display: flex;
			align-items: center;
			justify-content: space-between;

			padding: 0.4em;
			// margin: 0.6em 0.2em 0;
			margin: 0 0.2em;
			border-radius: 2em;
			// background: #fff;
			box-shadow: 4px 7px 24px 0 rgb(0 0 0 / 31%);
			background: var(--top2);
			position: var(--actions-position, sticky);

			:global(.s-dialog) & {
				left: 10px;
				bottom: 10px;
				right: 10px;
			}

			#amount {
				width: 2em;
				text-align: center;
				appearance: textfield;
				color: inherit;
			}
		}

		// $modalBP: 765px;
		$modalBP: 850px;

		@media screen and (min-width: 450px) {
			.add-to-cart-text {
				font-size: 1rem;
			}

			.actions {
				padding: 0.6em;
			}
		}

		@media screen and (min-width: $modalBP) {
			padding-bottom: 0;
			padding: var(--container-padding);

			.title {
				font-size: 2.5em;
				text-align: center;
			}

			.actions {
				bottom: 0;

				:global(.s-dialog) & {
					bottom: 10px;
				}
			}

			// .actions {
			// 	--actions-position: sticky;
			// }
		}
	}
</style>
