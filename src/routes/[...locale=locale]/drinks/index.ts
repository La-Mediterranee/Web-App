import { randomUUID } from 'node:crypto';

import type { RequestEvent, JSONObject, ShadowEndpointOutput } from '@sveltejs/kit/types/internal';

import type { MenuItem } from 'types/product';
import { SERVER_URL } from '$lib/server/constants';

//mineralwasser mit/ohne 1.5L 280
//eistee pfirsich/zitrone 1.5L 330
//aluvera 0.5L/0.3L

export async function get(event: RequestEvent): Promise<ShadowEndpointOutput> {
	const res = await fetch(`${SERVER_URL}/v1/products/drinks`);
	if (!res.ok) return {};

	const drinks: MenuItem[] = await res.json();

	return {
		body: <JSONObject>(<unknown>{
			drinks: drinks.map(
				drink => <MenuItem>Object.assign(drink, {
						ID: randomUUID(),
						type: 'drink',
						isAvailable: true,
						isVegetarian: false,
						category: 'drinks',
						toppings: [],
						categoryType: 'menuitem',
						image: {
							...drink.image,
							width: parseInt(250 * (drink.image.height / drink.image.width) + ''),
							height: parseInt(600 * (drink.image.height / drink.image.width) + ''),
							// width: 2,
							// height: 4,
						},
					}),
			),
		}),
	};
}
