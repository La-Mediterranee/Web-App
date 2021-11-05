// import { decodeJWT } from './server/helper';

import type { Request } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/helper';
import type { ServerResponse } from '@sveltejs/kit/types/hooks';
import type { auth as adminAuth } from 'firebase-admin';

const unSupportedBrowsers = ['MSIE.*', 'Trident.*'];

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

	// check for unsupported browsers
	// request.headers['user-agent'].indexOf('MSIE') >= 0

	const response = await resolve(request);

	if (/MSIE \d|Trident.*rv:/.test(request.headers['user-agent'])) {
		response.headers['Location'] = '/unsupported.html';
	}
	// // code here happens after the endpoint or page is called
	// response.headers['set-cookie'] = `user=${request.locals.user || ''}; Path=/; HttpOnly`;

	return response;
}

interface User {
	uid: string;
	email: string;
	avatar: string;
}

interface Session {
	user?: User;
}

export function getSession(request: Request): Session {
	const userDecoded = request.locals.user as adminAuth.DecodedIdToken;
	// console.log(user);

	const user = userDecoded
		? ({
				uid: userDecoded.uid,
				email: userDecoded.email,
				avatar: userDecoded.picture,
		  } as User)
		: undefined;
	return {
		user: user,
	};
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
