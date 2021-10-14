<svelte:options immutable />

<script lang="ts">
	import Icon from 'svelte-material-components/src/components/Icon/Icon.svelte';

	import { trash } from '$lib/Icons/filled';

	import type { CartItem } from 'types/interfaces';

	export let item: CartItem;

	const { image, name, price, sku } = item;
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
			<img src={image?.src} alt={image?.alt} />
			<h3>{name}</h3>
			<input type="hidden" name="product" id={sku} value={sku || name} />
		</div>
	</th>
	<td title="Anzahl">
		<input type="number" inputmode="numeric" id="quantity" bind:value={item.quantity} />
	</td>
	<td title="Preis"><span>{price}</span></td>
	<!-- <td title="Teilsumme"><span>{sum}</span></td> -->
	<td>
		<button on:click={() => console.log('delete')} aria-label="Produkt vom Warenkorb entfernen">
			<Icon path={trash} />
		</button>
	</td>
</tr>

<style lang="scss">
	img {
		height: 10rem;
	}

	th,
	td {
		color: var(--cart-table-color);
		display: flex;
		text-align: right;
		padding: 0.5em;
	}

	tr {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		background-color: var(--theme-secondary-color);
		border-radius: 1em;
		border-bottom: 0;
		margin-bottom: 0.625em;
		padding: 0.3em 0.2em;
	}

	div {
		width: 100%;
		text-align: center;
		margin-bottom: 0.6em;
	}

	button {
		height: 100%;
		// width: 100%;
		padding: 0.35em 1.2em;
		text-align: end;
	}

	th {
		flex: 1 0 100%;
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

	td {
		flex: 0 1 50%;

		span {
			width: 50%;
			text-align: center;
		}

		&:first-child,
		&:nth-child(2) {
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

	@media screen and (max-width: 459px) {
		td[title]:not(:first-child):before {
			content: attr(title) ': ';
			display: flex;
			align-items: center;
		}
	}

	@media screen and (min-width: 460px) {
		tr {
			display: table-row;
			border-bottom: 1px solid var(--cart-table-color);

			&:last-child {
				border: 0;
			}
		}

		th,
		td {
			display: table-cell;
			font-size: 1em;
			text-align: center;

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
	}
</style>
