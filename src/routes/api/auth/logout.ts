import { clearCookie } from '$lib/server/helper';

import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit/types';
import type { SessionLogin } from '../session/login';

export async function POST(req: RequestEvent): Promise<RequestHandlerOutput> {
	req.locals.user = null;

	const response = {
		status: 302,
		headers: {
			location: '/',
		},
	};

	clearCookie(response, 'session');

	return response;
}
