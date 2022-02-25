<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';

	import CartItemComponent, { animationDuration } from './CartItem.svelte';

	import { goto } from '$app/navigation';

	import { enhance } from './action';

	import type { Cart, CartStore } from '$lib/stores/cart';
	import { promiseTimeout } from '$lib/utils';

	export let cart: Cart;
	export let store: CartStore;

	$: totalAmount = new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: 'EUR',
	}).format(cart.totalAmount / 100);

	const tableHeaders = [
		{ header: 'Produkt', className: undefined },
		{ header: 'Anzahl', className: undefined },
		{ header: 'Preis', className: undefined },
		{ header: 'Actions', className: 'visually-hidden' },
	]; //'Teilsumme',
</script>

<h1 id="main-start">Warenkorb</h1>

<div id="cart">
	{#if cart.totalQuantity === 0}
		{#await promiseTimeout(animationDuration) then _}
			<p>No items in cart yet.</p>
		{/await}
	{:else}
		<form
			method="post"
			action="./cart"
			use:enhance={{
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
			}}
		>
			<table>
				<!-- <caption id="table-title" colspan={tableHeaders.length}>Produkte</caption> -->
				<thead>
					<tr>
						{#each tableHeaders as { header, className }}
							<th scope="col">
								<span class={className}>
									{header}
								</span>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody aria-live="polite">
					{#each [...cart.items] as [ID, item] (ID)}
						<CartItemComponent
							{item}
							updateQty={newQty => store.upadateItem(ID, newQty)}
							deleteItem={() => store.removeItem(item)}
						/>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan={tableHeaders.length}>
							<div>
								<label for="notes">Anmerkungen: </label>
								<textarea name="notes" id="notes" placeholder="Anmerkungen: " />
							</div>
						</td>
					</tr>
					<tr>
						<td colspan={tableHeaders.length - 2}>
							Summe ({cart.totalQuantity} Produkte): {totalAmount}
						</td>
						<td colspan="2">
							<Button type="submit" class="form-elements-color" rounded>
								Zur Kasse
							</Button>
						</td>
					</tr>
				</tfoot>
			</table>
		</form>
	{/if}
</div>

<style lang="scss">
	#cart {
		display: block;
		text-align: center;

		p {
			padding: 2em 0;
		}
	}

	h1 {
		text-align: center;
		margin: 0.2em 1.3em;
	}

	form {
		display: flex;
		justify-content: center;
	}

	table {
		max-width: 93%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-collapse: separate;
		border-radius: 1rem;
		border-spacing: 0 1em;
		text-align: center;
	}

	thead {
		background-color: var(--theme-primary-color);
		position: absolute;
		top: -9999px;
		left: -9999px;

		th {
			&:first-child {
				border-start-start-radius: 1em;
				border-end-start-radius: 1em;

				// border-top-left-radius: 1em;
				// border-bottom-left-radius: 1em;
			}

			&:last-child {
				border-start-end-radius: 1em;
				border-end-end-radius: 1em;
				// border-top-right-radius: 1em;
				// border-bottom-right-radius: 1em;
			}
		}
	}

	textarea {
		display: block;
		resize: none;
		border: 2px solid var(--tint-color);
		width: 100%;
		min-height: 6em;
		border-radius: 0.9em;
		padding: 0.8em;
		margin-top: 0.75em;
	}

	tfoot {
		text-align: center;
		border-radius: 1em;
		background-color: var(--theme-secondary-color);
		width: 100%;

		tr {
			color: var(--cart-table-color);
			text-align: center;
			width: 100%;

			div {
				text-align: left;
			}

			td {
				width: 100%;
				padding: 1em;
				text-align: right;

				&:first-child {
					border-start-start-radius: 1em;
					border-end-start-radius: 1em;
					// border-top-left-radius: 1em;
					// border-bottom-left-radius: 1em;
				}

				&:last-child {
					border-start-end-radius: 1em;
					border-end-end-radius: 1em;
					// border-top-right-radius: 1em;
					// border-bottom-right-radius: 1em;
				}
			}
		}
	}

	th {
		padding: 8px;
		padding-top: 12px;
		padding-bottom: 12px;
		text-align: center;
		color: var(--cart-table-color);
	}

	@media screen and (min-width: 460px) {
		table {
			display: table;
		}

		thead {
			position: relative;
			top: unset;
			left: unset;
		}

		tbody {
			display: table-row-group;
		}
	}
</style>
