import { panels } from '$lib/components/Checkout/panels';

import type { RequestEvent, ShadowEndpointOutput } from '@sveltejs/kit/types/internal';

function getSection(searchParams: URLSearchParams) {
	const section = searchParams.get('section');
	const prev = searchParams.get('prev');
	const next = +(searchParams.get('next') || 0);

	if (prev !== null) {
		return {
			value: [prev],
			currentValue: prev,
		};
	}

	return {
		value: [next],
		currentValue: next,
	};
}

export async function get(event: RequestEvent): Promise<ShadowEndpointOutput> {
	const section = getSection(event.url.searchParams);

	return {
		body: {
			...section,
		},
	};
}

export async function post(event: RequestEvent): Promise<ShadowEndpointOutput> {
	const section = event.url.searchParams.get('section');
	const prev = event.url.searchParams.get('prev');
	const next = +(event.url.searchParams.get('next') || 0);

	getSection(event.url.searchParams);

	const body = await event.request.formData();

	for (const el of body.entries()) {
		console.debug(el);
	}

	if (prev !== null) {
		return {
			body: {
				value: [prev],
				currentValue: prev,
			},
		};
	}

	switch (section) {
		case 'value':
			break;

		default:
			break;
	}

	console.debug(prev, next);

	return {
		body: {
			value: [next],
			currentValue: next,
		},
	};
}
