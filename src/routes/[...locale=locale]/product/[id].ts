import { SERVER_PORT, SERVER_URL } from '$lib/server/constants';

import type { Product } from 'types/product';
import type { WithContext, Product as DTSProduct } from 'schema-dts';
import type { RequestEvent, ResponseBody, RequestHandlerOutput } from '@sveltejs/kit/types';

interface GetBody {
	product: Product;
	jsonLd: WithContext<DTSProduct>;
}

export async function GET({ params }: RequestEvent): Promise<RequestHandlerOutput> {
	const { id } = params;

	const product: Product = await fetch(`${SERVER_URL}/v1/products/${id}`).then(res => res.json());

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
		body: body as unknown as ResponseBody,
	};
}
