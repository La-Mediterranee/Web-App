// import { decodeJWT } from './server/helper';

import type { Request } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/helper';
import type { ServerResponse } from '@sveltejs/kit/types/hooks';
import type { auth as adminAuth } from 'firebase-admin';

export async function handle({
	request,
	resolve,
}: {
	request: Request;
	resolve: (request: Request) => MaybePromise<ServerResponse>;
}) {
	// const cookies = cookie.parse(request.headers.cookie || '')
	// request.locals.user = cookies.user

	// code here happends before the endpoint or page is called
	// await decodeJWT(request);

	const response = await resolve(request);

	// // code here happens after the endpoint or page is called
	// response.headers['set-cookie'] = `user=${request.locals.user || ''}; Path=/; HttpOnly`;

	return response;
}

export function getSession(request: Request) {
	const user = request.locals.user as adminAuth.DecodedIdToken;
	// console.log(user);

	return user
		? {
				user: {
					// only include properties needed client-side —
					// exclude anything else attached to the user
					// like access tokens etc
					uid: user.uid,
					email: user.email,
					avatar: user.picture,
				},
		  }
		: {};
}

// import * as cookie from 'cookie';
// import { firestore } from './server/firebase';

// export async function getContext({ headers }) {
// 	let user = null;
// 	try {
// 		const cookies = cookie.parse(headers.cookie || '');
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

// export async function getSession({ context }) {
// 	return context;
// }
