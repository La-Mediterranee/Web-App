import type { EndpointOutput, Request } from '@sveltejs/kit';

type GetRequest<Locals = Record<string, any>, Input = unknown> = Request<Locals, Input>;

import { promisify } from 'util';
import { randomUUID } from 'crypto';

import type { Product } from 'types/product';

interface GetBody {
	product?: Product;
}

export async function get({ params }: GetRequest): Promise<EndpointOutput> {
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
		body: JSON.stringify(body),
	};
}
