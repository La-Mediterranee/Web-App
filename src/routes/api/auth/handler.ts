// import { Request } from '@sveltejs/kit';
// import { auth } from '../../../server/firebase';

// interface AccessTokenParams {
// 	tokenURL: string;
// 	clientID: string;
// 	clientSecret: string;
// 	code: string;
// }

// type Providers = 'steam' | 'discord' | 'firebase';

// export async function get(req: Request) {
// 	const state = req.query.get('state') as Providers;
// 	const code = req.query.get('code') as string;
// 	switch (state) {
// 		case 'steam':
// 			break;

// 		default:
// 			break;
// 	}
// 	// const accessToken = await getAccessToken({});
// 	// const user = await getUser('', accessToken);

// 	// this mutates the locals object on the request
// 	// and will be read by the hooks/handle function
// 	// after the resolve
// 	// req.locals.user = user.login;

// 	return {
// 		status: 302,
// 		headers: {
// 			location: '/',
// 		},
// 	};
// }

// async function getDiscordAccessToken(code: string) {
// 	return await getAccessToken({
// 		tokenURL: '',
// 		clientID: '',
// 		clientSecret: '',
// 		code,
// 	});
// }

// async function getDiscordUser(accessToken: string) {
// 	const user = await getUser('', accessToken);
// 	const uid = user.id;
// 	const token = await auth.createCustomToken(uid);
// 	const photoURL = !user.avatar
// 		? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=96x96`
// 		: `https://cdn.discordapp.com/embed/avatars/${user.discriminator}.png?size=96x96`;

// 	return {
// 		user,
// 		uid,
// 		token,
// 		photoURL,
// 	};
// }

// async function getAccessToken({
// 	tokenURL,
// 	clientID,
// 	clientSecret,
// 	code,
// }: AccessTokenParams) {
// 	const result = await fetch(tokenURL, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Accept: 'application/json',
// 		},
// 		body: JSON.stringify({
// 			client_id: clientID,
// 			client_secret: clientSecret,
// 			code,
// 		}),
// 	});

// 	const token = await result.json();
// 	return token.access_token;
// }

// async function getUser(userURL: string, accessToken: string) {
// 	const result = await fetch(userURL, {
// 		headers: {
// 			Accept: 'application/json',
// 			Authorization: `Bearer ${accessToken}`,
// 		},
// 	});
// 	return await result.json();
// }
