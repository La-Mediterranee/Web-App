import { auth } from './firebase';
import { serialize } from './cookie';

import type { Options } from './cookie';
import type { EndpointOutput } from '@sveltejs/kit';

/**
 * Decodes the JSON Web Token sent via the frontend app.
 * Makes the currentUser (firebase) data available on the body.
 */
export async function decodeJWT(authorization: string) {
	if (!authorization.startsWith('Bearer ')) return;

	try {
		const idToken = authorization.split('Bearer ')[1];
		return auth.verifyIdToken(idToken);
	} catch (err) {
		console.error(err);
	}
}

export function clearCookie(
	response: EndpointOutput | Response,
	name: string,
	options: Record<string, any> = {},
) {
	const opt = Object.assign({ expires: new Date(1), path: '/' }, options);

	if (response instanceof Response) {
		return response.headers.set('set-cookie', serialize(name, '', options));
	}

	response.headers = {
		'set-cookie': serialize(name, '', opt),
	};
}

export function setCookie(
	response: EndpointOutput | Response,
	name: string,
	value: string,
	options: Options = {},
) {
	if (response instanceof Response) {
		return response.headers.set('set-cookie', serialize(name, value, options));
	}

	response.headers = {
		'set-cookie': serialize(name, value, options),
	};
}
