<script context="module" lang="ts">
	import type { WithContext, Product as DTSProduct } from 'schema-dts';
	import type { MenuItem, Product } from 'types/product';
</script>

<script lang="ts">
	import LDTag from '$components/LDTag';
	import metatags from '$lib/stores/seo/metatags';
	import ProductPage from '$lib/components/Product/ProductPage/ProductPage.svelte';
	import { scale } from 'svelte/transition';

	export let product: MenuItem;
	export let jsonLd: WithContext<DTSProduct>;

	const { image, name, desc } = product;

	metatags.newTitle = name;
	metatags.newDesc = desc || '';
	metatags.newImage = image.src;
	metatags.newAlt = image.alt || `Das leckere ${name}`;
	metatags.newUrl = '';
</script>

<!-- <LDTag schema={jsonLd} /> -->

<div in:scale>
	<ProductPage {product} />
</div>

<style lang="scss">
	div {
		// background: var(--body-bg1);
		// position: absolute;
		// z-index: 9999;
		// top: 0;
		transform: translateY(-1em);
		--product-modal-aside-padding: 1em 0 0 0;
		// padding-bottom: 0.3em;
	}
</style>
