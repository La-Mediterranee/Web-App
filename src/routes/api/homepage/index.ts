import { SERVER_PORT, SERVER_URL } from '$lib/server/constants';

import type { MenuItem, Product } from 'types/product';
import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit/types/internal';

interface GetBody {
	product?: Product;
}

export async function get({ locals }: RequestEvent): Promise<RequestHandlerOutput> {
	return {
		body: JSON.stringify(await homepage()),
	};
}

interface HomepageSection<T> {
	title: string;
	body: T;
}

export interface HomepageProps {
	sections: HomepageSection<MenuItem[]>[];
	bestseller: Product[];
}

async function homepage(): Promise<HomepageProps> {
	const responses = await Promise.all([
		fetch(`${SERVER_URL}/v1/products`),
		fetch(`${SERVER_URL}/v1/products`),
	]);

	const sections = await Promise.all(responses.map(res => res.json()));
	const titles = ['Bestseller', 'Recommendation'];
	return {
		sections: sections.map((v, i) => ({
			title: titles[i],
			body: v,
		})),
		bestseller: sections[0],
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
