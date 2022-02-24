import { promisify } from 'util';
import { randomUUID } from 'crypto';

import { SERVER_PORT } from '$lib/server/constants';

import type { Product } from 'types/product';
import type { JSONObject } from '@sveltejs/kit/types/internal';
import type { WithContext, Product as DTSProduct } from 'schema-dts';
import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

interface GetBody {
	product: Product;
	jsonLd: WithContext<DTSProduct>;
}

export async function get({ params }: RequestEvent): Promise<EndpointOutput> {
	const { id } = params;

	const product: Product = await fetch(`http://localhost:${SERVER_PORT}/products/${id}`).then(
		res => res.json(),
	);

	const body: GetBody = {
		product,
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'Product',
			'image': product.image?.src,
			'name': product.name,
			'sku': product.sku,
			'offers': {
				'@type': 'Offer',
				'price': product.price,
				'priceCurrency': 'EUR',
				'availability': 'https://schema.org/InStock',
			},
			'aggregateRating': {
				'@type': 'AggregateRating',
				'ratingValue': product.rating?.value,
				'reviewCount': product.rating?.count,
			},
		},
	};

	return {
		body: body as unknown as JSONObject,
	};
}
