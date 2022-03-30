import { serialize } from '$lib/server/cookie';
import { fetchFromAPI } from '$lib/utils';

import type { RequestEvent, ShadowEndpointOutput } from '@sveltejs/kit/types/internal';

export async function get() {
	return {};
}

const checkoutCookie = 'check';

type ID = string;

interface ICartItem {
	readonly ID: ID;
	readonly categoryType: 'menuitem' | 'grocery';
	readonly quantity: number;
}

interface CartMenuItem extends ICartItem {
	readonly categoryType: 'menuitem';
	readonly selectedToppings: {
		readonly toppingID: ID;
		readonly toppingOptionID: ID | ID[];
	}[];
}

export async function post(event: RequestEvent): Promise<ShadowEndpointOutput> {
	if (event.locals.cookies.intentSecret)
		return {
			status: 303,
			headers: {
				location: `./checkout`,
			},
		};
	// const items = await event.request.text();

	const items: CartMenuItem[] = [
		{
			ID: 'rQTnF1yWUkWR8En6q2RA',
			categoryType: 'menuitem',
			quantity: 1,
			selectedToppings: [
				{
					toppingID: 'jqNrLNUjqmyoRbBrG2K7',
					// toppingOptionID: 'greek-salad',
					toppingOptionID: ['greek-salad'],
				},
				{
					toppingID: 'kiHoetrndsBM3ceKu8Q1',
					toppingOptionID: ['taratar', 'chilli'],
				},
			],
		},
		{
			ID: 'rQTnF1yWUkWR8En6q2RA',
			categoryType: 'menuitem',
			quantity: 1,
			selectedToppings: [],
		},
		{
			ID: '6fCGyZA1bC6TnVIyBQiW',
			categoryType: 'menuitem',
			quantity: 1,
			selectedToppings: [],
		},
	];

	console.log(await event.request.json());

	const res = await fetchFromAPI('/buy/create-payment-intent', {
		body: JSON.stringify(items),
	});

	if (!res.ok) {
		return {
			status: 400,
		};
	}

	const intent = await res.json();

	return {
		status: 303,
		headers: {
			'set-cookie': serialize('intentSecret', intent.clientSecret, {
				secure: true,
			}),
			'location': `./checkout`,
		},
	};
}
