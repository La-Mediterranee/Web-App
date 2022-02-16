import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

import { promisify } from 'util';
import { randomUUID } from 'crypto';

import type { Product } from 'types/product';

interface GetBody {
	product?: Product;
}

export async function get({ locals }: RequestEvent): Promise<EndpointOutput> {
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
	const responses = await Promise.all([
		fetch('http://localhost:8080/products'),
		fetch('http://localhost:8080/products'),
		fetch('http://localhost:8080/products'),
	]);

	const sections = await Promise.all(responses.map(res => res.json()));
	const titles = ['Bestseller', 'Food', 'Drinks'];
	return {
		sections: sections.map((v, i) => ({
			title: titles[i],
			body: v,
		})),
		bestseller: sections[0],
	};
}

function getSections() {
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

	return [bestsellerSection, foodSection, drinksSection];
}

async function getDummyProduct() {
	const res = await fetch('https://jsonplaceholder.typicode.com/albums/1/photos');
	const arr: Array<{ thumbnailUrl: string }> = await res.json();
	const sections = chunk(arr, 3).map(chunk => {
		return {
			title: 'Bestseller',
			body: chunk.map(val => {
				return {
					ID: randomUUID(),
					name: 'Hamburger',
					description: '',
					price: 4.5,
					categories: ['burger'],
					image: {
						src: val.thumbnailUrl,
						alt: 'Bild von einem Burger',
					},
					variations: {
						toppings: ['Beilagen', 'Saucen'],
					},
				};
			}),
		};
	});

	return sections;
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
