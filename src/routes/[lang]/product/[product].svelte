<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
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

	export let product: Product;

	const { categories, image, name, price, rating, sku, description } = product;

	metatags.newTitle = name;
	metatags.newDesc = description;
	metatags.newImage = image.src;
	metatags.newAlt = image.alt || `Das leckere ${name}`;
	metatags.newUrl = '';

	const jsonLd: WithContext<DTSProduct> = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		'image': image?.src,
		'name': name,
		'sku': sku,
		'offers': {
			'@type': 'Offer',
			'price': price,
			'priceCurrency': 'EUR',
			'availability': 'https://schema.org/InStock',
		},
		'aggregateRating': {
			'@type': 'AggregateRating',
			'ratingValue': rating?.value,
			'reviewCount': rating?.count,
		},
	};
</script>

<LDTag schema={jsonLd} />

<div>
	<pre>
		{JSON.stringify(product, null, 4)}
	</pre>
</div>

<style>
	/* your styles go here */
</style>
