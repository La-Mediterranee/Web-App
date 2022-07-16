// import { auth } from './firebase';
import { serialize } from './cookie';
import { SERVER_URL } from './constants';

import type { Options } from './cookie';
import type { ResponseHeaders, ShadowEndpointOutput } from '@sveltejs/kit/types';

import type * as nodeFetch from 'node-fetch';

// /**
//  * Decodes the JSON Web Token sent via the frontend app.
//  * Makes the currentUser (firebase) data available on the body.
//  */
// export async function decodeJWT(authorization: string) {
// 	if (!authorization.startsWith('Bearer ')) return;

// 	try {
// 		const idToken = authorization.split('Bearer ')[1];
// 		return auth.verifyIdToken(idToken);
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

export function clearCookie(
	response: ShadowEndpointOutput | Response,
	name: string,
	options: Record<string, any> = {},
) {
	const opt = Object.assign({ expires: new Date(1), path: '/' }, options);
	setCookie(response, name, '', opt);
}

const COOKIE_HEADER = 'set-cookie';

export function setCookie(
	response: ShadowEndpointOutput | Response,
	name: string,
	value: string,
	options: Options = {},
) {
	const cookie = serialize(name, value, options);

	if (response.headers instanceof Headers) {
		return response.headers.append(COOKIE_HEADER, cookie);
	}

	if (response.headers != null) {
		const headers = (response as ShadowEndpointOutput).headers as Partial<ResponseHeaders>;
		const currentCookies = headers[COOKIE_HEADER] as string | string[] | undefined;

		headers[COOKIE_HEADER] = currentCookies
			? Array.isArray(currentCookies)
				? currentCookies.push(cookie)
				: [cookie, currentCookies]
			: cookie;
	}

	(response as ShadowEndpointOutput).headers = {
		'set-cookie': cookie,
	};
}

export async function refreshSessionCookie(response: Response, uid: string) {
	const days = 14;
	const expiresIn = days * 60 * 60 * 24 * 1000;

	const res = await fetch(`${SERVER_URL}/v1/auth/session/extend`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			uid,
			expiresIn,
		}),
	});

	if (!res.ok) {
		const msg = await res.json();
		throw new Error((msg as Error).message);
	}

	const cookie = await res.json();

	setCookie(response, 'sessionId', cookie, {
		maxAge: expiresIn / 1000,
		httpOnly: true,
		secure: true,
		path: '/',
		// domain: ".",
	});

	return cookie;
}

export async function attachFetchGlobal() {
	const [{ default: https }, { default: fetch }] = await Promise.all([
		import('node:https'),
		import('node-fetch'),
	]);

	const agent = new https.Agent({
		rejectUnauthorized: false,
	});

	const myFetch = (input: RequestInfo, init: RequestInit = {}) =>
		fetch(<nodeFetch.RequestInfo>input, <nodeFetch.RequestInit>Object.assign(init, { agent }));

	Object.defineProperties(globalThis, {
		fetch: {
			enumerable: true,
			configurable: true,
			value: myFetch,
		},
	});
}
