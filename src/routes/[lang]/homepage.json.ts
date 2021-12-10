import type { EndpointOutput, Request } from '@sveltejs/kit';

type GetRequest<Locals = Record<string, any>, Input = unknown> = Request<Locals, Input>;

import { promisify } from 'util';
import { randomUUID } from 'crypto';

import type { Product } from 'types/product';

interface GetBody {
	product?: Product;
}

export async function get(): Promise<EndpointOutput> {
	return {
		body: JSON.stringify(homepage()),
	};
}

interface HomepageSection<T> {
	title: string;
	body: T;
}

export interface HomepageProps {
	sections: HomepageSection<unknown>[];
	bestseller: Product[];
}

function homepage(): HomepageProps {
	const p: Product = {
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

	const bestsellerSection: HomepageSection<Product[]> = {
		title: 'Bestseller',
		body: Array(10).fill(p),
	};

	const foodSection: HomepageSection<Product[]> = {
		title: 'Essen',
		body: Array(12).fill(p),
	};

	const drinksSection: HomepageSection<Product[]> = {
		title: 'Getränke',
		body: Array(7).fill(p),
	};

	const p1: Product = {
		ID: randomUUID(),
		name: 'Hamburger',
		description: '',
		price: 4.5,
		categories: ['burger'],
		image: { src: '/mask@3x.png', alt: 'Bild von einem Burger' },
		variations: {
			toppings: ['Beilagen', 'Saucen'],
		},
	};

	return {
		sections: [
			bestsellerSection,
			foodSection,
			drinksSection,
			{
				title: 'Getränke',
				body: Array(2).fill(p1),
			},
		],
		bestseller: Array(10).fill(p),
	};
}
