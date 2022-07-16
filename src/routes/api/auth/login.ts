import type { RequestEvent } from '@sveltejs/kit/types/internal';

export async function GET(req: RequestEvent) {
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

export async function POST(req: RequestEvent) {
	const form = await req.request.formData();

	console.debug(form.get('email'));
	console.debug(form.get('password'));
}
