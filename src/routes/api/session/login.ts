import { auth } from '$lib/server/firebase';
import { setCookie } from '$lib/server/helper';

import type { ShopLocals } from 'src/hooks';
import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

export interface SessionLogin {
	idToken: string;
	csrfToken: string;
}

export async function post(event: RequestEvent<ShopLocals>): Promise<EndpointOutput> {
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

		const decodedIdToken = await auth.verifyIdToken(idToken);
		// Only process if the user just signed in in the last 5 minutes.
		if (new Date().getTime() / 1000 - decodedIdToken.auth_time > 5 * 60) {
			return {
				status: 401,
				body: 'Recent sign in required!',
			};
		}

		const days = 14;
		const expiresIn = days * 60 * 60 * 24 * 1000;

		const sessionCookie = await auth.createSessionCookie(idToken, {
			expiresIn,
		});

		const response: EndpointOutput = {
			status: 303,
		};

		setCookie(response, 'sessionId', sessionCookie, {
			expires: new Date(0),
			maxAge: expiresIn,
			httpOnly: true,
			// domain: ".",
			// secure: true,
			path: '/',
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
