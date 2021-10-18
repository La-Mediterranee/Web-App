<svelte:options immutable />

<script context="module" lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { mdiClose } from '@mdi/js';

	import type { Product } from 'types/product';

	const AmountLabel = 'Menge';

	function addToCart(e: Event, variations: DeepReadonly<{ toppings?: string[] | undefined }>) {
		const ev = e as SubmitEvent;
		const form = ev.target as HTMLFormElement;
		const formData = new FormData(form);

		const selects = variations.toppings?.map((topping) => {
			return { [topping]: formData.get(topping) };
		});

		console.log(selects);
	}
</script>

<script lang="ts">
	import Button from 'svelte-material-components/src/components/Button';
	import Icon from 'svelte-material-components/src/components/Icon/Icon.svelte';
	import RadioButton from '$components/Forms/RadioButton.svelte';

	export let product: Product;
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';
	// export let close: () => void = () => {};
	let quantitiy = 1;

	const dispatch = createEventDispatcher();

	const { variations, price, description, name } = product;

	const _price = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(price);

	const addToCartBtnText = 'Zum Warenkorb hinzufügen';

	function close() {
		dispatch('close');
	}
</script>

<form id="product-modal" action="/add-to-cart" on:submit|preventDefault={(e) => addToCart(e, variations)}>
	<Button
		fab
		depressed
		size="small"
		style="position:absolute; top:0; right:1em; transform: translateY(-50%); background: var(--theme-surface)"
		on:click={close}
	>
		<Icon path={mdiClose} />
	</Button>
	<header class="info">
		<div class="header">
			<h1>{name}</h1>
			<span class="price">
				<data value={`${price}`}>{_price}</data>
			</span>
		</div>
		<p class="description">
			{description || ''}
		</p>
	</header>

	<div class="toppings">
		{#each variations.toppings || [] as topping}
			<fieldset class="topping">
				<legend>{topping}</legend>

				{#each ['kraken', 'sasquatch', 'mothman'] as item}
					<div class="topping-item">
						<RadioButton id={`${topping}-${item}`} name={topping} value={item} />
						<label for={`${topping}-${item}`}>{item.slice(0, 1)?.toUpperCase() + item.substring(1)}</label>
						<button class="info-button" type="button" on:click={() => console.log('Hi')}>&#9432;</button>
					</div>
				{/each}
			</fieldset>
		{/each}
	</div>

	<div class="actions pt-2">
		<div>
			<Button size="small" disabled={quantitiy <= 1 || quantitiy == null} fab on:click={() => quantitiy--}>
				-
			</Button>
			<label for="amount" class="visually-hidden">{AmountLabel}</label>
			<input id="amount" type="number" inputmode="numeric" bind:value={quantitiy} min="1" />
			<Button size="small" fab on:click={() => quantitiy++}>+</Button>
		</div>

		<Button type="submit" class="form-elements-color" rounded>
			<span class="add-to-cart-text">{addToCartBtnText}</span>
		</Button>
	</div>
</form>

<style lang="scss" global>
	.s-dialog__content {
		overflow-y: visible !important;
	}

	#product-modal {
		accent-color: var(--accent-color, orange);
		width: 42em;
		padding: 2em;
		color: #fff;

		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
		}

		.price {
			font-size: 1.2em;
			font-weight: 500;
		}

		.info {
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.toppings {
		}

		.topping {
			border: none;
			margin: 1em 0;
			padding: 0.4em 0;

			legend {
				font-size: 1.5em;
				font-weight: 600;
			}
		}

		.topping-item {
			display: flex;
			align-items: center;
			padding: 0 0.6em;

			&:hover {
				background: rgb(99, 165, 209);
				border-radius: 0.5em;
			}

			.info-button {
				margin-left: auto;
			}

			label {
				font-size: 1.2em;
				padding: 0.6em 0;
				padding-left: 0.5em;
				width: 100%;
				height: 100%;
			}
		}

		.add-to-cart-text {
			color: #fff;
			font-size: 1.2em;
			font-weight: 600;
		}

		.actions {
			display: flex;
			align-items: center;
			justify-content: space-between;

			input {
				width: 3em;
				text-align: center;
				appearance: textfield;
			}
		}
	}
</style>
