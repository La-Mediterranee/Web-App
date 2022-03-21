<script context="module" lang="ts">
	import t from '$i18n/i18n-svelte';

	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { scale, fade, crossfade } from 'svelte/transition';
	import { cubicInOut, quintOut } from 'svelte/easing';

	import { enhance } from './action';

	import { formatPrice, type Cart, type CartState, type CartStore } from '$lib/stores/cart';
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

	function submitBuilder(): FormEnhance {
		return {
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

	const tableHeaders: TableHeader[] = [
		{ header: 'product', headerClass: 'cart-product-header', className: undefined },
		{ header: 'quantity', headerClass: 'cart-quantity-header', className: undefined },
		{ header: 'price', headerClass: 'cart-price-header', className: undefined },
		{ header: 'actions', headerClass: 'cart-actions-header', className: 'visually-hidden' },
	]; //'Teilsumme',
</script>

<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';

	import CartItemComponent from './table/CartItem.svelte';
	import CartItem from './table/CartItem/CartItem.svelte';

	import CartFooter from './table/CartFooter.svelte';
	import CartHeader from './table/CartHeader.svelte';

	import CartItemPrice from './table/CartItem/Price.svelte';
	import CartItemProduct from './table/CartItem/Product.svelte';
	import CartItemQuantity from './table/CartItem/Quantity.svelte';
	import CartItemActions from './table/CartItem/Actions.svelte';

	import type { TableHeader } from './table/CartHeader.svelte';
	import type { ID } from 'types/product';

	export let cart: Cart;
	export let state: CartState;
	export let store: CartStore;

	function updateItem(e: Event, ID: ID) {
		store.upadateItem(ID, +(<HTMLInputElement>e.currentTarget).value);
	}

	$: isEmpty = cart.totalQuantity === 0;
	$: busy = state === 'Loading';
</script>

<div id="cart">
	<h1>
		{$t.cart.cart()}
	</h1>

	<form method="post" data-action="./cart" use:enhance={submitBuilder()}>
		<!-- 
			if the table's diplay property changes it loses it's role and that goes for any table element
			https://css-tricks.com/position-sticky-and-table-headers/
			-->
		<!-- svelte-ignore a11y-no-redundant-roles -->
		<table role="table">
			<caption id="table-title" class="visually-hidden" colspan={tableHeaders.length}>
				{$t.cart.cartItems()}
			</caption>
			<thead role="rowgroup">
				<tr role="row">
					<CartHeader headers={tableHeaders} />
				</tr>
			</thead>
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
					{#each [...cart.items] as [ID, item] (ID)}
						{@const { price, image, name, quantity } = item}
						<tr
							role="row"
							class="item"
							in:fade={{
								delay: 200,
								duration: 600,
							}}
							out:send|local={{ key: ID }}
							animate:flip={{ duration: 600 }}
						>
							<CartItem>
								<CartItemProduct {ID} {image}>
									{name}
								</CartItemProduct>
								<CartItemQuantity
									{ID}
									{quantity}
									on:change={e => updateItem(e, ID)}
								/>
								<CartItemPrice>
									{formatPrice(price)}
								</CartItemPrice>
								<CartItemActions on:click={() => store.removeItem(item)} />
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
							<p class="state">No items in cart yet.</p>
						</CartItem>
					</tr>
				{/if}
			</tbody>
		</table>
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

		table {
			display: grid;
			gap: 1em;
			grid-template-columns: 1fr;
			border-radius: 1rem;
			border-spacing: 0 1em;
			width: 100%;

			position: relative;
			justify-content: center;
			align-items: center;
			max-width: 100%;
		}

		thead,
		tbody,
		tr,
		.cart-actions {
			display: flex;
		}

		thead,
		tbody,
		.cart-actions {
			flex-direction: column;
		}

		thead {
			display: flex;
			position: sticky;
			width: 100%;
			z-index: 1;
			border-radius: 1em;
			top: calc(var(--top-bar-height) + 10px);
			background-color: var(--theme-primary-color);
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

			table {
				flex: 1 0 58%;
				max-width: 58%;
				align-self: flex-start;
			}

			thead {
				display: flex;
				position: sticky;
				width: 100%;
				top: calc(var(--top-bar-height) + 10px);
				left: 0;
			}

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

			table {
				flex: 1 0 60%;
				max-width: 60%;
			}
		}
	}
</style>
