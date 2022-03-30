<script context="module" lang="ts">
	import LL from '$i18n/i18n-svelte';

	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { scale, fade, crossfade } from 'svelte/transition';
	import { cubicInOut, quintOut } from 'svelte/easing';

	import {
		formatPrice,
		type Cart,
		type CartItems,
		type CartState,
		type CartStore,
	} from '$lib/stores/cart';
	import type { FormEnhance } from './action';

	function fadeScale(
		node: HTMLElement,
		{ delay = 0, duration = 200, easing = (x: number) => x, baseScale = 0 },
	) {
		const o = +getComputedStyle(node).opacity;
		const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
		const s = m ? +m[1] : 1;
		const is = 1 - baseScale;

		return {
			delay,
			duration,
			css: (t: number) => {
				const eased = easing(t);
				return `opacity: ${eased * o}; transform: scale(${eased * s * is + baseScale})`;
			},
		};
	}

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

	function createFormDataFromCart(cart: CartItems) {
		const form = new FormData();
		for (const [ID, item] of cart) {
			form.append(item.ID, JSON.stringify(item));
		}
		return form;
	}

	function submitBuilder(cart: CartItems): FormEnhance {
		return {
			extra: createFormDataFromCart(cart),
			result: res => {
				//
				console.debug(res);
				if (res.redirected) {
					goto(res.url);
				}
			},
			error: (_, e) => {
				console.error(e);
			},
		};
	}

	function replacer(key: string, value: any) {
		if (value instanceof Map) {
			const object = {};

			return {
				dataType: 'Map',
				value: Array.from(value.values()),
			};
		}

		return value;
	}

	async function submitCart(e: SubmitEvent, items: CartItems) {
		const form = <HTMLFormElement>e.currentTarget;

		// const body = new Map();
		// for (const [ID, item] of items) {
		// 	body.set(item.ID, {
		// 		ID: item.ID,
		// 		categoryType: 'menuitem',
		// 		selectedToppings: (<MenuCartItem>item).selectedToppings,
		// 		quantity: item.quantity,
		// 	});
		// }

		const body = [];

		for (const [ID, item] of items) {
			body.push({
				ID: item.ID,
				categoryType: 'menuitem',
				selectedToppings: (<MenuCartItem>item).selectedToppings,
				quantity: item.quantity,
			});
		}

		const res = await fetch(form.action, {
			method: form.method,
			headers: {
				'method': 'POST',
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (res.redirected) goto(res.url);
	}

	const tableHeaders: TableHeader[] = [
		{ header: 'product', headerClass: 'cart-product-header', className: undefined },
		{ header: 'quantity', headerClass: 'cart-quantity-header', className: undefined },
		{ header: 'price', headerClass: 'cart-price-header', className: undefined },
		{ header: 'actions', headerClass: 'cart-actions-header', className: 'visually-hidden' },
	]; //'Teilsumme',
</script>

<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';

	import CartTable from './table/CartTable.svelte';
	import CartFooter from './table/CartFooter.svelte';
	import CartHeaders from './table/CartHeaders.svelte';

	import CartItem from './table/CartItem/CartItem.svelte';
	import CartItemPrice from './table/CartItem/Price.svelte';
	import CartItemProduct from './table/CartItem/Product.svelte';
	import CartItemQuantity from './table/CartItem/Quantity.svelte';
	import CartItemActions from './table/CartItem/Actions.svelte';

	import type { TableHeader } from './table/CartHeaders.svelte';
	import type { ID, MenuCartItem } from 'types/product';

	export let cart: Cart;
	export let state: CartState;
	export let store: CartStore;

	function updateItem(e: Event, key: ID, index: number) {
		store.upadateItem(key, index, +(<HTMLInputElement>e.currentTarget).value);
	}

	$: isEmpty = cart.totalQuantity === 0;
	$: busy = state === 'Loading';
</script>

<div id="cart">
	<h1>
		{$LL.cart.cart()}
	</h1>

	<form
		method="post"
		data-action="./cart"
		on:submit|preventDefault={e => submitCart(e, cart.items)}
	>
		<!-- use:enhance={submitBuilder(cart.items)} -->
		<!-- 
			if the table's diplay property changes it loses it's role and that goes for any table element
			https://css-tricks.com/position-sticky-and-table-headers/
			-->
		<!-- svelte-ignore a11y-no-redundant-roles -->
		<CartTable>
			<caption id="table-title" class="visually-hidden" colspan={tableHeaders.length}>
				{$LL.cart.cartItems()}
			</caption>
			<CartHeaders headers={tableHeaders} />
			<tbody role="rowgroup" aria-live="polite" aria-busy={busy}>
				{#if busy}
					<tr
						colspan={tableHeaders.length}
						class="state"
						in:fadeScale={{
							delay: 100,
							duration: 400,
							easing: cubicInOut,
							baseScale: 0.5,
						}}
					>
						<CartItem>
							<td class="cart-item" style="width: 100%;"> Loading </td>
						</CartItem>
					</tr>
				{:else if !isEmpty}
					{#each [...cart.items] as [cartID, item], i (cartID)}
						{@const { ID, price, image, name, quantity } = item}
						<tr
							role="row"
							class="item"
							data-cartId={cartID}
							in:fade={{
								delay: 200,
								duration: 600,
							}}
							out:send|local={{ key: cartID }}
							animate:flip={{ duration: 600 }}
						>
							<CartItem>
								<CartItemProduct {ID} {image}>
									{name}
								</CartItemProduct>
								<CartItemQuantity
									{ID}
									{quantity}
									on:change={e => updateItem(e, cartID, i)}
								/>
								<CartItemPrice>
									{formatPrice(price)}
								</CartItemPrice>
								<CartItemActions on:click={() => store.removeItem(cartID, i)} />
							</CartItem>
						</tr>
					{/each}
				{:else}
					<tr
						role="row"
						class="item"
						in:fadeScale={{
							delay: 100,
							duration: 400,
							easing: cubicInOut,
							baseScale: 0.5,
						}}
					>
						<CartItem>
							<p class="state">
								{$LL.cart.empty()}
							</p>
						</CartItem>
					</tr>
				{/if}
			</tbody>
		</CartTable>
		<Card class="cart-actions" role="group">
			<CartFooter disabled={isEmpty}>
				<svelte:fragment slot="notes">Anmerkungen</svelte:fragment>

				<svelte:fragment slot="quantity">
					Summe ({cart.totalQuantity} Produkte):
				</svelte:fragment>
				{cart.displayTotalAmount}

				<svelte:fragment slot="submit-text">Zur Kasse</svelte:fragment>
			</CartFooter>
		</Card>
	</form>
</div>

<style lang="scss" global>
	#cart {
		--cart-item-product-width: min(45%, 40em);
		--cart-item-quantity-width: 5em;
		--cart-item-price-width: min(20%, 7em);
		--cart-item-actions-width: 3em;

		padding: 0 0.7em;

		display: flex;
		flex-direction: column;

		height: 100%;
		margin-bottom: 1em;

		h1 {
			text-align: center;
			margin: 0.2em 1.3em;
		}

		.state {
			padding: 2em 0;
			justify-self: center;
		}

		.cart {
			&-product-header {
				flex: 1 1 var(--cart-item-product-width);
			}

			&-quantity-header {
				flex: 0 0 var(--cart-item-quantity-width);
			}

			&-price-header {
				flex: 0 1 var(--cart-item-price-width);
			}

			&-actions-header {
				flex: 0 1 var(--cart-item-actions-width);
			}
		}

		form {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			width: 100%;
			margin: 0 auto;
		}

		tbody,
		tr,
		.cart-actions {
			display: flex;
		}

		tbody,
		.cart-actions {
			flex-direction: column;
		}

		.item {
			display: flex;
			align-items: center;
			background-color: var(--theme-secondary-color);
			border-radius: 1em;
			margin-bottom: 0.625em;
			height: 13rem;
			// flex-wrap: wrap;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.cart-actions {
			text-align: start;
			border-radius: 1em;
			width: 100%;
			color: var(--cart-table-color);
			background-color: var(--theme-secondary-color);
			padding: 1em;
			margin-top: 1.5em;
			position: var(--cart-action-position);
		}

		@media screen and (min-width: 360px) {
			.item-product {
				flex: 1 0 var(--cart-item-product-width);
			}
		}

		@media screen and (min-width: 460px) {
			tbody {
				width: 100%;
				display: flex;
				flex-direction: column;
			}

			.item {
				// display: table-row;
				width: 100%;
			}
		}

		@media screen and (min-width: 960px) {
			// --cart-item-product-width: 11rem;
			--cart-action-position: sticky;

			.cart-actions {
				flex: 1 0 30%;
				align-self: flex-start;
				top: calc(var(--top-bar-height) + 10px);
				margin: 0;
				margin-inline-start: auto;
				max-width: 23.5rem;
			}
		}

		@media screen and (min-width: 1060px) {
			padding: 1em;

			form {
				max-width: 93%;
			}
		}
	}
</style>
