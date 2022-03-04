<svelte:options immutable />

<script context="module" lang="ts">
	export const animationDuration = 600;

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: animationDuration,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t};
				`,
			};
		},
	});
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Input from 'svelty-material/components/Input/Input.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	import { trash } from '$lib/Icons/filled';

	import type { CartItem } from 'types/product';
	import { formatPrice } from '$lib/stores/cart';

	export let item: CartItem;
	export let updateQty: (e: number) => void;
	export let deleteItem: () => void;

	function update(e: Event) {
		updateQty(+(<HTMLInputElement>e.currentTarget).value);
	}

	let qty = item.quantity;
	// $: updateQty(qty);

	const { image, name, price, ID } = item;
</script>

<th class="item-product" role="rowheader" scope="row">
	<div>
		<img aria-hidden="true" src={image.src} alt={image.alt} />
		<h3>{name}</h3>
		<p class="desc" />
		<input type="hidden" name="product" id={ID} value={ID} />
	</div>
</th>
<td role="cell" class="item-quantity">
	<Input>
		<!-- pattern="[0-9]*" -->
		<input
			id="quantity-{ID}"
			min="1"
			max="10"
			name="quantity"
			type="number"
			inputmode="numeric"
			required
			on:change={e => update(e)}
			bind:value={qty}
		/>
	</Input>
</td>
<td role="cell" class="item-price">
	{formatPrice(price)}
</td>
<td role="cell" class="item-action">
	<Button icon on:click={deleteItem} aria-label="Produkt vom Warenkorb entfernen">
		<Icon path={trash} />
	</Button>
</td>

<style lang="scss">
	th,
	td {
		color: var(--cart-table-color);
		padding: 0.3em;
	}

	div {
		width: 100%;
		text-align: center;
		margin: 0.4em 0 0.3em;
		padding-inline-start: 0.5em;
	}

	img {
		height: auto;
		width: auto;
		max-width: 100%;
		max-height: 6rem;
	}

	.item {
		&-product {
			flex: 1 1 var(--cart-item-product-width);
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

	// @media screen and (max-width: 459px) {
	// 	td[title]:not(:first-child):before {
	// 		content: attr(title) ': ';
	// 		display: flex;
	// 		align-items: center;
	// 	}
	// }

	@media screen and (min-width: 320px) {
		.item-quantity {
			max-width: unset;
		}
	}

	@media screen and (min-width: 340px) {
		.item-product {
			flex: initial;

			img {
				max-height: 7.5rem;
			}
		}
	}

	@media screen and (min-width: 460px) {
		th,
		td {
			display: table-cell;
			font-size: 1em;
			text-align: center;

			&:first-child {
				padding-left: 0.5em;

				@media screen and (min-width: 460px) {
					// border-top-left-radius: 1em;
					// border-bottom-left-radius: 1em;
					border-start-start-radius: 1em;
					border-end-start-radius: 1em;
				}
			}

			&:last-child {
				padding-right: 0.5em;

				@media screen and (min-width: 460px) {
					border-start-end-radius: 1em;
					border-end-end-radius: 1em;
					// border-top-right-radius: 1em;
					// border-bottom-right-radius: 1em;
				}
			}
		}
	}

	@media screen and (min-width: 600px) {
		.item-product {
			div {
				display: flex;
				justify-items: flex-start;
				align-items: flex-start;
			}

			// max-width: var(--cart-item-product-width);
			img {
				margin-inline-end: 0.6em;
			}
		}
	}
</style>
