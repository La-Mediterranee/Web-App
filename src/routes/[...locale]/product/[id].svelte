<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';
	import type { WithContext, Product as DTSProduct } from 'schema-dts';
	import type { Product } from 'types/product';

	interface ProductParams extends Record<string, string> {
		product: string;
	}

	interface ProductLoadInput extends LoadInput {
		params: ProductParams;
	}
</script>

<script lang="ts">
	import LDTag from '$components/LDTag';
	import metatags from '$lib/stores/seo/metatags';
	import ProductPage from '$lib/components/Product/ProductPage/ProductPage.svelte';

	export let product: Product;
	export let jsonLd: WithContext<DTSProduct>;

	const { image, name, desc } = product;

	metatags.newTitle = name;
	metatags.newDesc = desc || '';
	metatags.newImage = image.src;
	metatags.newAlt = image.alt || `Das leckere ${name}`;
	metatags.newUrl = '';
</script>

<LDTag schema={jsonLd} />

<div>
	<ProductPage {product} />
</div>

<style lang="scss">
	div {
		transform: translateY(-1em);
		--product-modal-aside-padding: 1em 0 0 0;
		// padding-bottom: 0.3em;
	}
</style>
