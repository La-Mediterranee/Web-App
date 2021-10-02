import type { Request } from '@sveltejs/kit';

// import { decodeJWT } from '../../../server/helper';

// export async function post(req: Request) {
// 	try {
// 		await decodeJWT(req);
// 		return {
// 			status: 200,
// 			body: 'ok',
// 		};
// 	} catch (error) {
// 		console.error(error);
// 		return {
// 			status: 500,
// 			body: 'forbidden',
// 		};
// 	}
// }

const ghAuthURL = 'https://github.com/login/oauth/authorize';
const clientId = import.meta.env.VITE_CLIENT_ID;

export async function get(req: Request) {
	const sessionId = '1234';
	return {
		status: 302,
		headers: {
			location: `${ghAuthURL}?client_id=${clientId}&state=${sessionId}`,
		},
	};
}
