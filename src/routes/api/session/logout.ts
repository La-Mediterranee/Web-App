import { clearCookie } from '$lib/server/helper';

import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

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

export function head(req: RequestEvent): EndpointOutput {
	req.locals.user = null;

	const response = {};

	clearCookie(response, 'sessionId');

	return response;
}
