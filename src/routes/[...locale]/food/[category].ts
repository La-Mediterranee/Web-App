import { EDAMAM_API_KEY } from '$lib/server/constants';

import type { EndpointOutput, RequestEvent, JSONObject } from '@sveltejs/kit/types/internal';

const data = new Map();

export async function get(event: RequestEvent): Promise<EndpointOutput> {
	const { category } = event.params;

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
		body: <JSONObject>{
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
