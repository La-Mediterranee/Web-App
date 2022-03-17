<script lang="ts">
	import type { CartItem } from 'types/product';

	export let ID: CartItem['ID'];
	// export let name: CartItem['name'];
	export let image: CartItem['image'];
</script>

<th class="cart-item item-product" role="rowheader" scope="row">
	<div class="img-container">
		<img aria-hidden="true" src={image.src} alt={image.alt} />
		<h3 class="name">
			<slot />
		</h3>
	</div>
	<p class="desc" />
	<input type="hidden" name="product" id={ID} value={ID} />
</th>

<style lang="scss">
	img {
		height: auto;
		width: auto;
		max-width: 100%;
		max-height: 7.5rem;
	}

	.item-product {
		--_img-width: var(--cart-img-width, 9rem);

		flex: 0 1 var(--cart-item-product-width);
		font-size: 0.85em;
		color: var(--cart-table-color);
		padding: 0.3em;
		font-size: 1em;
		text-align: center;
	}

	.img-container {
		text-align: center;
		margin: 0.4em 0 0.3em;
		padding-inline-start: 0.5em;
		width: min(100%, var(--_img-width));
		margin: auto;
	}
</style>
