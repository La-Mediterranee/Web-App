<script lang="ts">
	import ExpansionPanel from '$material/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from '$material/components/ExpansionPanels/ExpansionPanels.svelte';
	import Image from '../Image/Image.svelte';

	let showSummary = false;
	let ariaLabel = 'Bestellzusammenfassung';
	let quantity = 0;

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
	<button
		type="button"
		aria-expanded={showSummary}
		aria-controls="order-summary"
	>
		Bestellung anzeigen
	</button>
	<table>
		<caption class="visually-hidden">Warenkorb</caption>
		<thead class="product-table__header">
			<tr>
				<th scope="col">
					<span class="visually-hidden">Produktbild</span>
				</th>
				<th scope="col">
					<span class="visually-hidden">Beschreibung</span>
				</th>
				<th scope="col"><span class="visually-hidden">Anzahl</span></th>
				<th scope="col"><span class="visually-hidden">Preis</span></th>
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
					<td>
						<span class="sum">
							{item.price * item.quantity} €
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</aside>

<style>
	button {
		width: 100%;
	}

	aside {
		position: relative;
		width: 100%;
		flex: 0 1 40%;
	}

	table {
		width: 100%;
		border-collapse: collapse;
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
