import { Request } from '@sveltejs/kit';

export async function get(req: Request) {
	const code = req.query.get('code') as string;
	const accessToken = await getAccessToken(code);
	const user = await getUser(accessToken);

	// this mutates the locals object on the request
	// and will be read by the hooks/handle function
	// after the resolve
	req.locals.user = user.login;

	return {
		status: 302,
		headers: {
			location: '/',
		},
	};
}

async function getAccessToken(tokenURL: string, code: string) {
	const result = await fetch(tokenURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: secret,
			code,
		}),
	});
	const token = await result.json();
	return token.access_token;
}

async function getUser(userURL: string, accessToken: string) {
	const r = await fetch(userURL, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return await r.json();
}
