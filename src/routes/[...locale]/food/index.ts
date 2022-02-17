import { EDAMAM_API_KEY } from '$lib/server/constants';
import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/helper';

let data: Object | null = null;

export async function get(event: RequestEvent): Promise<EndpointOutput> {
	if (!data) {
		console.log('fetching');
		const res = await fetch('https://edamam-recipe-search.p.rapidapi.com/search?q=burger', {
			headers: {
				'x-rapidapi-host': 'edamam-recipe-search.p.rapidapi.com',
				'x-rapidapi-key': EDAMAM_API_KEY,
			},
		})
			.then(response => response.json())
			.catch(err => {
				console.error(err);
			});

		data = res;
	}

	return {
		body: <JSONObject>{
			res: (data as any).hits.map(({ recipe }: any) => {
				return {
					label: recipe.label,
					image: recipe.image,
					ing: recipe.ingredients.map((n: any) => n.text + ' '),
				};
			}),
			categories: [
				'burger',
				'sandwiches',
				'fish',
				'burger',
				'sandwiches',
				'fish',
				'burger',
				'sandwiches',
				'fish',
				'burger',
				'sandwiches',
				'fish',
			],
		},
	};
}
