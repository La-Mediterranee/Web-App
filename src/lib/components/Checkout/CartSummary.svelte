<script lang="ts">
	import ExpansionPanel from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanels.svelte';
	import CartItem from '../Cart/CartItem.svelte';
	import Image from '../Image/Image.svelte';

	import type { SKU, CartItem as ICartItem } from 'types/interfaces';
	import type { Cart } from '$lib/stores/cart';

	export let cart: Cart;
	// new Map([SKU,
	// 	{
	// 		name: 'Burger',
	// 		image: {
	// 			src: '/burger.webp',
	// 		},
	// 		price: 3,
	// 		quantity: 4,
	// 		categories: [''],
	// 	},
	// ]);

	export let total: number;
	export let quantity: number;

	let showSummary = false;
	let ariaLabel = 'Bestellzusammenfassung';
	// let quantity = 0;

	const headers = ['Produktbild', 'Beschreibung', 'Anzahl', 'Preis'];

	const cartItems = [
		{
			name: 'Burger',
			image: {
				src: '/burger.webp',
			},
			price: 3,
			quantity: 4,
		},
	];
</script>

<aside aria-label={ariaLabel}>
	<button type="button" aria-expanded={showSummary} aria-controls="order-summary"> Bestellung anzeigen </button>
	<table>
		<caption class="visually-hidden">Warenkorb</caption>
		<thead>
			<tr>
				{#each headers as header}
					<th scope="col">
						<span class="visually-hidden">{header}</span>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each cartItems as item}
				<tr class="item">
					<td>
						<div class="image">
							<img src={item.image.src} alt="" />
							<span class="quantity">{item.quantity}</span>
						</div>
					</td>
					<th scope="row">
						<span>{item.name}</span>
					</th>
					<td>
						<span class="visually-hidden">
							{item.quantity}
						</span>
					</td>
					<td class="sum">
						<span>
							{item.price * item.quantity} €
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th scope="row" colspan={headers.length - 1}>
					Summe <em>(inkl. MwSt.)</em>
				</th>
				<td> 30 €</td>
			</tr>
		</tfoot>
	</table>
</aside>

<style lang="scss">
	button {
		width: 100%;

		@media (min-width: 960px) {
			display: none;
		}
	}

	aside {
		position: relative;
		width: 100%;
		flex: 1 0 37%;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	td,
	th {
		white-space: nowrap;
	}

	tfoot {
		td,
		th {
			padding: 0.7em 0;
		}

		th {
			text-align: left;
		}
	}

	.item {
		position: relative;

		.image {
			margin: 1.2em 0.4em;
			position: relative;
			width: 10em;
		}

		img {
			width: 100%;
		}

		td,
		th {
			/* border: 0.12em solid #ddd; */
			border-top: 0.12em solid #ddd;
			border-bottom: 0.12em solid #ddd;
			border-radius: 1em;
		}

		th {
			padding-left: 0.8em;
			text-align: left;
			width: 100%;
		}
	}

	.sum {
		width: 100%;
		white-space: nowrap;
	}

	.quantity {
		background-color: var(--theme-cards);
		position: absolute;
		text-align: center;
		font-weight: 500;
		line-height: 1.75em;
		border-radius: 1.75em;
		right: -0.75em;
		top: -0.75em;
		min-width: 1.75em;
		height: 1.75em;
		padding: 0 0.5833333333em;
		z-index: 3;
	}
</style>
