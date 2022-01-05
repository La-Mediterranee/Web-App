import { auth } from '../../../server/firebase';
import { serialize } from '../../../server/cookie';

import type { ShopLocals } from 'src/hooks';
import type { EndpointOutput, Request } from '@sveltejs/kit';

interface SessionLogin {
	idToken: string;
	csrfToken: string;
}

export async function post(
	req: Request<ShopLocals, SessionLogin>
): Promise<EndpointOutput> {
	const body = req.body as SessionLogin;

	try {
		const idToken = body.idToken;
		const csrfToken = body.csrfToken;

		if (csrfToken !== req.locals.cookies.csrfToken) {
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

		// Set session expiration to 5 days.
		const expiresIn = 60 * 60 * 24 * 5 * 1000;

		const sessionCookie = await auth.createSessionCookie(idToken, {
			expiresIn,
		});

		return {
			status: 303,
			headers: {
				'location': '/',
				'set-cookie': serialize('session', sessionCookie, {
					expires: new Date(0),
					maxAge: expiresIn,
					httpOnly: true,
					// secure: true,
					path: '/',
				}),
			},
		};
	} catch (error) {
		console.error(error);
		return {
			status: 401,
			body: 'UNAUTHORIZED REQUEST!',
		};
	}
}
