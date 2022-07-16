import { SERVER_URL } from '../constants';

import type { Handle } from '@sveltejs/kit';
import type { AuthError } from 'firebase/auth';
import { refreshSessionCookie } from '../helper';

async function verifySessionCookie(token: JwtToken) {
	const res = await fetch(`${SERVER_URL}/v1/auth/session/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain' },
		body: token,
	});

	return res.json();
}

export const userParser: Handle = async ({ event, resolve }) => {
	try {
		const sessionId = event.locals.cookies.sessionId;
		event.locals.user = sessionId ? await verifySessionCookie(sessionId) : null;
	} catch (_e) {
		const err = _e as AuthError;
		console.error(`parseUser() -> ${err.code}: ${err.message}`);
		event.locals.user = null;
	}

	const response = await resolve(event);

	response.headers.append('access-control-allow-credentials', 'true');
	response.headers.append(
		'access-control-allow-headers',
		'Accept,Accept-Language,Authorization,Content-Type,Cookie',
	);

	if (!event.locals.user) return response;

	const current = Date.now();
	const expiration = new Date(1970, 0, 1).setSeconds(event.locals.user.exp);
	const intervalInHours = Math.abs(expiration - current) / 36e5;

	if (intervalInHours > 24) return response;

	await refreshSessionCookie(response, event.locals.user.uid);

	return response;
};

// interface HandleProps {
// 	request: ShopHookRequest;
// 	resolve(request: ShopHookRequest): Promise<Response>;
// }

// import { firestore } from './server/firebase';

// export async function getContext({ headers }) {
// 	let user = null;
// 	try {
// 		const cookies = parse(headers.cookie || '');
// 		const sessionId = cookies['__session'];
// 		if (!sessionId) {
// 			return {
// 				context: { user },
// 			};
// 		}
// 		const sessDoc = firestore.collection(`sessions`).doc(sessionId);
// 		const session = (await sessDoc.get()).data();
// 		if (!session) {
// 			return {
// 				context: { user },
// 			};
// 		}
// 		user = JSON.parse(session.sess);
// 		const { uid } = user;
// 		const userSnap = await firestore.collection('users').doc(uid).get();
// 		const userData = userSnap.data();

// 		return {
// 			context: { user, userData },
// 		};
// 	} catch (e) {
// 		console.error('hooks.js', e);
// 		return {
// 			context: { user },
// 		};
// 	}
// }
