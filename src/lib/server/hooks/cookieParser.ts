import { parse } from '../cookie';

import type { Handle } from '@sveltejs/kit';

export const cookieParser: Handle = async ({ event, resolve }) => {
	event.locals.cookies = parse<Cookies>(event.request.headers.get('cookie') || '');
	return resolve(event);
};
