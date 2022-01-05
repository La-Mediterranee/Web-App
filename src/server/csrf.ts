import * as crypto from 'crypto';
import { promisify } from 'util';

import { serialize } from './cookie';

import type { Handle } from '@sveltejs/kit';

const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * Create a new CSRF token.
 */
export async function createToken() {
	return (await randomBytesAsync(32)).toString('hex');
}

export function attachCsrfToken(url: string, cookieName: string): Handle {
	return async ({ request, resolve }) => {
		const res = await resolve(request);

		if (request.url.pathname === url) {
			res.headers['set-cookie'] = serialize(
				cookieName,
				await createToken()
			);
		}

		return res;
	};
}
