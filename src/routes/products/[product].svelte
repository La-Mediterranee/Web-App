<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { WithContext, Product as DTSProduct } from 'schema-dts';
	import type { Product } from 'types/interfaces';

	export function load({ page }: LoadInput): LoadOutput {
		const product: Product = {
			categories: [],
			image: {
				src: '',
				alt: '',
			},
			name: '',
			price: 2,
			sku: '',
		};

		return {
			props: {
				product,
			},
		};
	}
</script>

<script lang="ts">
	import LDTag from '$components/LDTag';
	import Alert from 'svelte-material-components/src/components/Alert';
	import metatags from '$lib/stores/metatags';

	export let product: Product;

	const { categories, image, name, price, rating, sku } = product;

	metatags.newTitle = name;
	metatags.newDesc = '';
	metatags.newImage = image.src;
	metatags.newAlt = image.alt || `Das leckere ${name}`;
	metatags.newUrl = '';

	const jsonLd: WithContext<DTSProduct> = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		image: image.src,
		name: name,
		sku: sku,
		offers: {
			'@type': 'Offer',
			price: price,
			priceCurrency: 'EUR',
			availability: 'https://schema.org/InStock',
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: rating?.value,
			reviewCount: rating?.count,
		},
	};
</script>

<LDTag schema={jsonLd} />

<style>
	/* your styles go here */
</style>
