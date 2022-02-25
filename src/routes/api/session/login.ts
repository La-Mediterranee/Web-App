import { baseLocale } from '$i18n/i18n-util';
import { auth, firebase } from '$lib/server/firebase';
import { setCookie } from '$lib/server/helper';

import type { EndpointOutput, RequestEvent } from '@sveltejs/kit/types/internal';

export interface SessionLogin {
	idToken: string;
	csrfToken: string;
}

export async function post(event: RequestEvent): Promise<EndpointOutput> {
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

		await auth.setCustomUserClaims(decodedIdToken.uid, { locale: event.locals.locale });

		const days = 14;
		const expiresIn = days * 60 * 60 * 24 * 1000;

		const sessionCookie = await auth.createSessionCookie(idToken, {
			expiresIn,
		});

		const location = `${
			event.locals.locale !== baseLocale ? '/' + event.locals.locale : ''
		}/customer`;

		const response: EndpointOutput = {
			status: 302,
			headers: { location },
			body: JSON.stringify({
				location,
			}),
		};

		setCookie(response, 'sessionId', sessionCookie, {
			// expires: new Date(0),
			maxAge: expiresIn / 1000,
			httpOnly: true,
			path: '/',
			secure: true,
			// domain: ".",
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
