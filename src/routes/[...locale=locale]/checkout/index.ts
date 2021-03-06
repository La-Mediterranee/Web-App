import { dev } from '$app/env';

import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit/types';

function getSection(searchParams: URLSearchParams) {
	const section = searchParams.get('section');
	const prev = +(searchParams.get('prev') || 0);
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

export async function GET(event: RequestEvent): Promise<RequestHandlerOutput> {
	if (!dev && typeof event.locals.cookies.intentSecret === 'undefined')
		return {
			status: 302,
			headers: {
				location: '/',
			},
		};

	const section = getSection(event.url.searchParams);

	return {
		body: {
			...section,
		},
	};
}

export async function POST(event: RequestEvent): Promise<RequestHandlerOutput> {
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
