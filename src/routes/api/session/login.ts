import { dev } from '$app/env';
import { SERVER_PORT } from '$lib/server/constants';
import { setCookie } from '$lib/server/helper';
import { SERVER_URL } from '$lib/utils/constants';

import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit/types/internal';

export interface SessionLogin {
	idToken: string;
	csrfToken: string;
}

async function fetchWithJSON(init: RequestInit) {
	Object.assign(init, {
		headers: {
			'content-type': 'application/json',
		},
	});
	return fetch(`${SERVER_URL}/v1/auth/session`, init);
}

const days = 14;
const defaultExpiresIn = days * 60 * 60 * 24 * 1000;

export async function POST(event: RequestEvent): Promise<RequestHandlerOutput> {
	const body = (await event.request.json()) as SessionLogin;

	try {
		const idToken = body.idToken;
		const csrfToken = body.csrfToken;

		if (csrfToken !== event.locals.cookies.csrfToken) {
			return {
				status: 401,
				body: 'UNAUTHORIZED REQUEST!',
			};
		}

		const res = await fetchWithJSON({
			method: 'POST',
			body: JSON.stringify({
				idToken,
				locale: event.locals.locale,
			}),
		});

		if (!res.ok) {
			throw new Error('Error creating session cookie');
		}

		const { cookie, expiresIn = defaultExpiresIn } = await res.json();

		const location = `${event.locals.urlLocale}/customer`;

		const response: RequestHandlerOutput = {
			status: 302,
			headers: { location },
			body: JSON.stringify({
				location,
			}),
		};

		setCookie(<Response>response, 'sessionId', cookie, {
			maxAge: expiresIn / 1000,
			httpOnly: true,
			path: '/',
			secure: true, //!dev
			// domain: '127.0.0.1',
			// sameSite: 'none',
		});

		return response;
	} catch (error) {
		console.error(error);
		return {
			status: 401,
			body: 'UNAUTHORIZED REQUEST!',
		};
	}
}
