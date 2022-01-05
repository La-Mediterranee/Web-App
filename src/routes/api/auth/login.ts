import { auth } from 'firebase-admin';

import type { Request } from '@sveltejs/kit';
import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';

export async function get(req: Request) {
	const sessionId = '1234';
	const ghAuthURL = 'https://github.com/login/oauth/authorize';
	const clientId = import.meta.env.VITE_CLIENT_ID;

	return {
		status: 302,
		headers: {
			location: `${ghAuthURL}?client_id=${clientId}&state=${sessionId}`,
		},
	};
}

export async function post(req: Request) {
	const form = req.body as ReadOnlyFormData;

	console.debug(form.get('email'));
	console.debug(form.get('password'));
}
