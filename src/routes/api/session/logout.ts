import { clearCookie } from '$lib/server/helper';

import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit/types';

// export async function post(req: RequestEvent): Promise<EndpointOutput> {
// 	req.locals.user = null;

// 	const response = {
// 		// status: 302,
// 		// headers: {
// 		// 	location: '/',
// 		// },
// 	};

// 	clearCookie(response, 'sessionId');

// 	return response;
// }

export function HEAD(req: RequestEvent): RequestHandlerOutput {
	req.locals.user = null;

	const response = {};

	clearCookie(response, 'sessionId');

	return response;
}
