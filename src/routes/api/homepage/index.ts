import type { EndpointOutput, Request } from '@sveltejs/kit';

type GetRequest<Locals = Record<string, any>, Input = unknown> = Request<Locals, Input>;

import { promisify } from 'util';
import { randomUUID } from 'crypto';

import type { Product } from 'types/product';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

interface GetBody {
	product?: Product;
}

export async function get({ locals }: ServerRequest<Record<string, any>, unknown>): Promise<EndpointOutput> {
	return {
		body: JSON.stringify(await homepage()),
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

async function homepage(): Promise<HomepageProps> {
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

	// const res = await fetch('https://jsonplaceholder.typicode.com/albums/1/photos');
	// const arr: Array<{ thumbnailUrl: string }> = await res.json();
	// const sections = chunk(arr, 3).map(chunk => {
	// 	return {
	// 		title: 'Bestseller',
	// 		body: chunk.map(val => {
	// 			return {
	// 				ID: randomUUID(),
	// 				name: 'Hamburger',
	// 				description: '',
	// 				price: 4.5,
	// 				categories: ['burger'],
	// 				image: { src: val.thumbnailUrl, alt: 'Bild von einem Burger' },
	// 				variations: {
	// 					toppings: ['Beilagen', 'Saucen'],
	// 				},
	// 			};
	// 		}),
	// 	};
	// });

	return {
		sections: [bestsellerSection, foodSection, drinksSection],
		// sections,
		bestseller: Array(10).fill(p),
	};
}

function chunk<T>(array: Array<T>, chunk: number = 4) {
	let tmp: Array<Array<T>> = [];
	const arrSize = array.length;
	const chunkLength = Math.floor(arrSize / chunk);

	let len = chunkLength;

	for (let i = 0; i < arrSize; i += chunkLength) {
		tmp.push(array.slice(i, len));
		len = Math.min(len + chunkLength, arrSize);
	}

	return tmp;
}
