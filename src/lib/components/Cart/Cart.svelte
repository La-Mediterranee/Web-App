<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { scale, fade, crossfade } from 'svelte/transition';
	import { cubicInOut, quintOut } from 'svelte/easing';

	import { enhance } from './action';

	import type { Cart, CartState, CartStore } from '$lib/stores/cart';
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
		{ header: 'Produkt', headerClass: 'cart-product-header', className: undefined },
		{ header: 'Anzahl', headerClass: undefined, className: undefined },
		{ header: 'Preis', headerClass: undefined, className: undefined },
		{ header: 'Actions', headerClass: undefined, className: 'visually-hidden' },
	]; //'Teilsumme',
</script>

<script lang="ts">
	import CartItemComponent from './table/CartItem.svelte';
	import CartFooter from './table/CartFooter.svelte';
	import CartHeader from './table/CartHeader.svelte';

	import type { TableHeader } from './table/CartHeader.svelte';

	export let cart: Cart;
	export let state: CartState;
	export let store: CartStore;
</script>

<h1 id="main-start">Warenkorb</h1>

<div id="cart">
	{#if state === 'Loading'}
		<p
			class="state"
			in:fadeScale={{
				delay: 100,
				duration: 400,
				easing: cubicInOut,
				baseScale: 0.5,
			}}
		>
			Loading
		</p>
	{:else if cart.totalQuantity !== 0}
		<form method="post" data-action="./cart" use:enhance={submitBuilder()}>
			<!-- 
			if the table's diplay property changes it loses it's role and that goes for any table element
			https://css-tricks.com/position-sticky-and-table-headers/
			-->
			<!-- svelte-ignore a11y-no-redundant-roles -->
			<table
				role="table"
				in:fade={{
					delay: 200,
					duration: 600,
				}}
			>
				<caption id="table-title" class="visually-hidden" colspan={tableHeaders.length}>
					Warenkorb
				</caption>
				<thead role="rowgroup">
					<tr role="row">
						<CartHeader headers={tableHeaders} />
					</tr>
				</thead>
				<tbody role="rowgroup" aria-live="polite">
					{#each [...cart.items] as [ID, item] (ID)}
						<tr
							role="row"
							class="item"
							out:send|local={{ key: item.ID }}
							animate:flip={{ duration: 600 }}
						>
							<CartItemComponent
								{item}
								updateQty={newQty => store.upadateItem(ID, newQty)}
								deleteItem={() => store.removeItem(item)}
							/>
						</tr>
					{/each}
				</tbody>
				<tfoot role="rowgroup">
					<CartFooter
						headersLength={tableHeaders.length}
						totalQuantity={cart.totalQuantity}
						totalAmount={cart.displayTotalAmount}
					/>
				</tfoot>
			</table>
		</form>
	{:else}
		<!-- if cart.totalQuantity === 0 && state === 'Done' -->
		<p
			class="state"
			in:fadeScale={{
				delay: 100,
				duration: 400,
				easing: cubicInOut,
				baseScale: 0.5,
			}}
		>
			No items in cart yet.
		</p>
	{/if}
</div>

<style lang="scss" global>
	#main-start {
		text-align: center;
		margin: 0.2em 1.3em;
	}

	#cart {
		--cart-item-product-width: 9rem;

		display: flex;
		flex-direction: column;
		text-align: center;
		margin-bottom: 1em;
		height: 100%;

		.state {
			padding: 2em 0;
			justify-self: center;
		}

		.cart-product-header {
			flex: 1 0 var(--cart-item-product-width);
		}

		form {
			display: flex;
			justify-content: center;
		}

		table {
			display: grid;
			gap: 1em;
			grid-template-columns: 1fr;
			max-width: 93%;

			border-radius: 1rem;
			border-spacing: 0 1em;

			position: relative;
			justify-content: center;
			align-items: center;
		}

		tbody,
		tfoot,
		thead,
		tr {
			display: flex;
		}

		tbody,
		tfoot,
		thead {
			flex-direction: column;
		}

		thead {
			background-color: var(--theme-primary-color);
			border-radius: 1em;
			z-index: 1;

			// position: absolute;
			// top: -9999px;
			// left: -9999px;

			position: sticky;
			width: 100%;
			top: calc(var(--top-bar-height) + 10px);
		}

		.item {
			display: flex;
			align-items: center;
			background-color: var(--theme-secondary-color);
			border-radius: 1em;
			margin-bottom: 0.625em;
			padding: 0.3em 0.2em;
			height: 13rem;
		}

		tfoot {
			text-align: center;
			border-radius: 1em;
			background-color: var(--theme-secondary-color);
			width: 100%;
		}

		@media screen and (min-width: 460px) {
			table {
				// display: table;
				grid-template:
					'head foot'
					'body foot';
			}

			thead {
				display: flex;
				position: sticky;
				width: 100%;
				top: calc(var(--top-bar-height) + 10px);
				left: 0;
				grid-area: head;
			}

			tbody {
				width: 100%;
				display: flex;
				flex-direction: column;
				grid-area: body;
			}

			tfoot {
				grid-area: foot;
				align-self: flex-start;
			}

			.item {
				// display: table-row;
				width: 100%;
			}
		}
	}
</style>
