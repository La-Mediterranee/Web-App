import { EDAMAM_API_KEY } from '$lib/server/constants';

import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit/types';

const data = new Map();

export async function GET(event: RequestEvent): Promise<RequestHandlerOutput> {
	const { category } = event.params;

	console.log(event.url.pathname);

	const path = event.url.pathname;

	if (!category)
		return {
			status: 301,
			headers: {
				location: event.url.pathname + '/popular',
			},
		};

	if (category == 'popular') {
		return {
			body: {
				body: 'popular',
			},
		};
	}

	if (!data.has(category)) {
		console.log('fetching');
		const res = await fetch(
			`https://edamam-recipe-search.p.rapidapi.com/search?q=${category}`,
			{
				headers: {
					'x-rapidapi-host': 'edamam-recipe-search.p.rapidapi.com',
					'x-rapidapi-key': EDAMAM_API_KEY,
				},
			},
		)
			.then(response => response.json())
			.catch(err => {
				console.error(err);
			});

		data.set(event.params, res);
	}

	const hits = <any[]>data.get(event.params).hits;

	return {
		body: {
			res: hits.map(({ recipe }: any) => {
				return {
					label: recipe.label,
					image: recipe.image,
					ing: recipe.ingredients.map((n: any) => n.text + ' '),
				};
			}),
		},
	};
}
