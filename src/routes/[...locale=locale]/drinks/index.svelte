<script lang="ts">
	import LL from '$i18n/i18n-svelte';

	import MenuItemCard from '$lib/components/MenuItem/MenuItemCard.svelte';
	import type { CartItem, MenuItem } from 'types/product';

	export let drinks: any[];
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';

	import { cart, formatPrice } from '$lib/stores/cart';
	import { session } from '$app/stores';

	const header = 'Drinks';

	function addToCart(product: MenuItem) {
		cart.addItem(
			<CartItem>(<unknown>Object.assign({ quantity: 1, selectedToppings: [] }, product)),
		);
	}
</script>

<h1>{header}</h1>
<div>
	{#each drinks as drink}
		<MenuItemCard
			style="flex: 0 1 32%;"
			href="{$session.urlLocale}/product/{drink.ID}"
			product={drink}
			label={{
				item: $LL.menuItem.label.drink(),
				price: $LL.product.price(),
			}}
			on:click={() => addToCart(drink)}
		>
			<svelte:fragment>
				{drink.name}
			</svelte:fragment>

			<data slot="price" itemprop="price" value={`${drink.price}`}>
				{formatPrice(drink.price, locale)}
			</data>

			<svelte:fragment slot="cta">
				{$LL.product.addToCart()}
			</svelte:fragment>
		</MenuItemCard>
	{/each}
</div>

<style lang="scss">
	h1 {
		padding-top: 0.6em;
		text-align: center;
		width: 100%;
	}

	div {
		--repeat: auto-fill;
		--menu-item-img-height: 200px;
		--menu-item-img-width: 5.2em;
		--menu-item-img-mbs: 0.7em;

		$drink-cars-size: 15.3125em;
		$grid-gap: 1.2em;
		$mq: calc($drink-cars-size * 4 + 3 * $grid-gap);

		display: grid;
		grid-template-columns: repeat(var(--repeat), $drink-cars-size);

		gap: $grid-gap;
		padding: 1em 0.4em;
		justify-content: center;

		@media screen and (min-width: $mq) {
			--repeat: 4;
		}

		:global(img) {
			margin-top: 1em;
			margin-bottom: 0.2em;
			object-fit: contain;
			height: 9.5em;
		}
	}
</style>
