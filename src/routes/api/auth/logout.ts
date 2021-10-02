import type { Request } from '@sveltejs/kit';

export async function get(req: Request) {
	req.locals.user = null;

	return {
		status: 302,
		headers: {
			location: '/',
		},
	};
}
