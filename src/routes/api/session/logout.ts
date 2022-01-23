import { clearCookie } from '$lib/server/helper';

import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';
import type { ShopLocals } from 'src/hooks';
import type { SessionLogin } from '../session/login';

export async function post(req: RequestEvent<ShopLocals>): Promise<EndpointOutput> {
	req.locals.user = null;

	const response = {
		status: 302,
		headers: {
			location: '/',
		},
	};

	clearCookie(response, 'session_id');

	return response;
}
