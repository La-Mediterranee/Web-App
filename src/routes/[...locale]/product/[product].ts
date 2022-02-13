import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

import { promisify } from 'util';
import { randomUUID } from 'crypto';

import type { Product } from 'types/product';
import type { JSONValue } from '@sveltejs/kit/types/helper';

interface GetBody {
	product?: Product;
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
	};

	return {
		body: body as JSONValue,
	};
}
