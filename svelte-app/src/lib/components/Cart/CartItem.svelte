<script>
	import { Trash } from '$lib/Icons/filled';

	export let item: Product;
	export let quantity: number;

	const { image, name, price, sku } = item;

	$: sum = price * quantity;
</script>

<!-- <div itemscope itemtype="https://schema.org/Product">
	<img itemprop="image" decoding="async" class="ml-auto" src={image?.src} alt={image?.alt} />
	<h4 itemprop="name" class="justify-center h4">{name}</h4>
	<span itemprop="priceCurrency" content="EUR">€</span>
	<span class="price" itemprop="price" content={`price`}>{sum}</span>
</div> -->

<tr>
	<th scope="row" title="Produkt">
		<div>
			<img src={image.src} alt={image.alt} />
			<h3>{name}</h3>
			<input type="hidden" name="product" id={sku} value={sku || name} />
		</div>
	</th>
	<td title="Anzahl">
		<input type="number" id="quantity" bind:value={quantity} />
	</td>
	<td title="Preis"><span>{price}</span></td>
	<!-- <td title="Teilsumme"><span>{sum}</span></td> -->
	<td on:click={() => console.log('delete')}>
		<button aria-label="Produkt vom Warenkorb entfernen">
			<Trash />
		</button>
	</td>
</tr>

<style lang="scss">
	img {
		height: 10rem;
	}

	tr {
		border-bottom: 1px solid var(--cart-table-color);
		background-color: var(--theme-secondary-color);
		border-radius: 1em;

		&:last-child {
			border: 0;
		}
	}

	th,
	td {
		font-size: 1em;
		text-align: center;
		color: var(--cart-table-color);

		&:first-child {
			padding-left: 0.5em;

			@media screen and (min-width: 460px) {
				border-top-left-radius: 1em;
				border-bottom-left-radius: 1em;
			}
		}

		&:last-child {
			padding-right: 0.5em;

			@media screen and (min-width: 460px) {
				border-top-right-radius: 1em;
				border-bottom-right-radius: 1em;
			}
		}
	}

	div {
		width: 100%;
		text-align: center;
		margin-bottom: 0.6em;
	}

	button {
		height: 100%;
	}

	td input {
		flex: 1 0 30%;
		padding: 0.6em;
		width: 3em;
		border-radius: 5px;
		border: 1px solid var(--cart-table-color);
		text-align: center;
		color: inherit;
	}

	@media screen and (max-width: 459px) {
		tr {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			width: 100%;
			border-bottom: 0;
			margin-bottom: 0.625em;
			padding: 0.3em 0.2em;
		}

		th,
		td {
			display: flex;
			text-align: right;
			padding: 0.5em;
			flex: 1 0 100%;
		}

		td {
			span {
				width: 50%;
				text-align: center;
			}

			&:first-child,
			&:nth-child(2) {
				padding-top: 0;
				border: 0 none;
			}

			input {
				padding: 0.2em;
				flex: 1 0 30%;
			}

			&:before {
				display: table-cell;
				white-space: nowrap;
				width: 50%;
				text-align: left;
			}
		}

		td[title]:not(:first-child):before {
			content: attr(title) ': ';
			display: flex;
			align-items: center;
		}
	}
</style>
