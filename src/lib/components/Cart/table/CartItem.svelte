<svelte:options immutable />

<script context="module" lang="ts">
	export const animationDuration = 600;
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Input from 'svelty-material/components/Input/Input.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import { trash } from '$lib/Icons/filled';
	import { formatPrice } from '$lib/stores/cart';

	import type { CartItem } from 'types/product';

	export let item: CartItem;
	export let updateQty: (e: number) => void;
	export let deleteItem: () => void;

	const { image, name, price, ID } = item;
</script>

<th class="item-product" role="rowheader" scope="row">
	<div class="img-container">
		<img aria-hidden="true" src={image.src} alt={image.alt} />
		<h3 class="name">{name}</h3>
	</div>
	<p class="desc" />
	<input type="hidden" name="product" id={ID} value={ID} />
</th>
<td role="cell" class="item-quantity">
	<Input>
		<input
			id="quantity-{ID}"
			min="1"
			max="10"
			name="quantity"
			pattern="[0-9]*"
			type="number"
			inputmode="numeric"
			required
			on:change={e => updateQty(+e.currentTarget.value)}
			bind:value={item.quantity}
		/>
	</Input>
</td>
<td role="cell" class="item-price">
	{formatPrice(price)}
</td>
<td role="cell" class="item-action">
	<Button icon on:click={deleteItem} aria-label="Produkt vom Warenkorb entfernen">
		<Icon path={trash} ariaHidden={true} />
	</Button>
</td>

<style lang="scss">
	th,
	td {
		color: var(--cart-table-color);
		padding: 0.3em;
		font-size: 1em;
		text-align: center;
	}

	img {
		height: auto;
		width: auto;
		max-width: 100%;
		max-height: 7.5rem;
	}

	.item {
		&-product {
			--internal-img-width: var(--cart-img-width, 9rem);

			flex: 0 1 var(--cart-item-product-width);
			font-size: 0.85em;
		}

		&-quantity {
			flex: 0 0 var(--cart-item-quantity-width);
			max-width: 4em;

			:global(.s-input__slot) {
				margin: 0;
			}

			input {
				flex: 1 0 30%;
				padding: 0.2em;
				width: 3em;
				border-radius: 5px;
				border: 1px solid var(--cart-table-color);
				text-align: center;
				color: inherit;

				&:out-of-range {
					border: 2px var(--error-color-border-color) solid;
				}
			}
		}

		&-price {
			flex: 0 1 var(--cart-item-price-width);
			text-align: center;
		}

		&-action {
			flex: 0 1 var(--cart-item-actions-width);
		}
	}

	.img-container {
		text-align: center;
		margin: 0.4em 0 0.3em;
		padding-inline-start: 0.5em;
		width: min(100%, var(--internal-img-width));
		margin: auto;
	}

	@media screen and (min-width: 320px) {
		.item-quantity {
			max-width: unset;
		}
	}

	@media screen and (min-width: 460px) {
		th,
		td {
			font-size: 1em;
			text-align: center;

			&:first-child {
				padding-inline-start: 0.5em;
			}

			&:last-child {
				padding-inline-end: 0.5em;
			}
		}
	}
</style>
