<script>
	import { cart } from '$lib/stores/cart';
	import { enhance } from './action';
	import CartItemComponent from './CartItem.svelte';

	const items: CartItem[] = [
		{
			name: 'Burger',
			image: {
				src: '/burger.png'
			},
			price: 2.3,
			quantity: 1
		},
		{
			name: 'Burger',
			image: {
				src: '/burger.png'
			},
			price: 2.3,
			quantity: 1
		}
	];

	const tableHeaders = ['Produkt', 'Anzahl', 'Preis', '']; //'Teilsumme',
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<h1>Warenkorb</h1>

<div>
	{#if $cart.length !== 0}
		<p>No items in cart yet.</p>
	{:else}
		<form
			action="/checkout"
			use:enhance={{
				result: () => {
					//
				}
			}}
		>
			<table>
				<caption id="table-title" colspan={tableHeaders.length}>Produkte</caption>
				<thead>
					<tr>
						{#each tableHeaders as header}
							<th scope="col">{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each items as item}
						<CartItemComponent {item} quantity={item.quantity} />
					{/each}

					<!-- {#each $cart as item (item.name)}
					<CartItemComponent {item} quantity={item.quantity} />
					{/each} -->
				</tbody>
				<tfoot>
					<tr>
						<td colspan={tableHeaders.length}>
							<div>
								<label for="notes">Anmerkungen: </label>
								<textarea
									name="notes"
									id="notes"
									cols="45"
									rows="5"
									placeholder="Anmerkungen: "
								/>
							</div>
						</td>
					</tr>
					<tr>
						<td colspan={tableHeaders.length - 1}>
							Summe ({$cart.length} Produkte): {$cart.length}
						</td>
						<td colspan="1">
							<button> Zur Kasse </button>
						</td>
					</tr>
				</tfoot>
			</table>
		</form>
	{/if}
	<!-- <div class="total-label">
		<h2>Gesamt: {$cart.length}</h2>
	</div> -->
</div>

<style lang="scss">
	h1 {
		text-align: center;
		margin: 0.2em 1.3em;
	}

	#table-title {
		font-size: 1.6rem;
		margin-bottom: 0.7em;
		width: 100%;
	}

	div {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	thead {
		background-color: var(--theme-primary-color);

		th {
			&:first-child {
				border-top-left-radius: 1em;
				border-bottom-left-radius: 1em;
			}

			&:last-child {
				border-top-right-radius: 1em;
				border-bottom-right-radius: 1em;
			}
		}
	}

	table {
		border-collapse: separate;
		border-radius: 1rem;
		border-spacing: 0 1em;
	}

	tfoot {
		width: 100%;
		background-color: var(--theme-secondary-color);

		tr {
			color: var(--cart-table-color);

			td {
				padding: 1em;
				text-align: right;

				&:first-child {
					border-top-left-radius: 1em;
					border-bottom-left-radius: 1em;
				}

				&:last-child {
					border-top-right-radius: 1em;
					border-bottom-right-radius: 1em;
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

	// .total-label {
	// 	margin-top: 0.7em;
	// 	width: 90%;

	// 	h2 {
	// 		align-self: flex-end;
	// 	}
	// }

	button {
		width: 100%;
		text-align: center;
	}

	@media screen and (max-width: 459px) {
		table,
		thead,
		tbody,
		th,
		tr {
			display: block;
		}

		#table-title {
			display: flex;
			justify-content: center;
		}

		table thead {
			position: absolute;
			top: -9999px;
			left: -9999px;
		}

		tfoot {
			width: 100%;

			tr {
				width: 100%;

				td {
					width: 100%;
				}
			}
		}
	}
</style>
