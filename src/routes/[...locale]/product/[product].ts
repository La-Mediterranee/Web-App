import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

import { promisify } from 'util';
import { randomUUID } from 'crypto';

import type { Product } from 'types/product';
import type { JSONObject, JSONValue } from '@sveltejs/kit/types/helper';
import type { WithContext, Product as DTSProduct } from 'schema-dts';

interface GetBody {
	product: Product;
	jsonLd: WithContext<DTSProduct>;
}

export async function get({ params }: RequestEvent): Promise<EndpointOutput> {
	// const { product } = params;
	const product: Product = {
		ID: randomUUID(),
		name: 'Hamburger',
		description: '',
		price: 4.5,
		categories: ['burger'],
		image: { src: '/burger.webp', alt: 'Bild von einem Burger' },
		variations: {
			toppings: ['Beilagen', 'Saucen'],
		},
	};

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
