// import { decodeJWT } from './server/helper';

import { detectLocale } from '$i18n/i18n-util';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

import type { Request } from '@sveltejs/kit';
import type { ServerResponse } from '@sveltejs/kit/types/hooks';
import type { auth as adminAuth } from 'firebase-admin';
import type { Locales } from '$i18n/i18n-types';

const unSupportedBrowsers = ['MSIE.*', 'Trident.*'];

interface HandleProps {
	request: Request;
	resolve(request: Request): Promise<ServerResponse>;
}

export async function handle({ request, resolve }: HandleProps) {
	// const cookies = cookie.parse(request.headers.cookie || '')
	// request.locals.user = cookies.user

	// code here happends before the endpoint or page is called
	// await decodeJWT(request);

	const response = await resolve(request);

	// check for unsupported browsers
	if (/MSIE \d|Trident.*rv:/.test(request.headers['user-agent'])) {
		response.headers['Location'] = '/unsupported.html';
	}

	// // code here happens after the endpoint or page is called
	// response.headers['set-cookie'] = `user=${request.locals.user || ''}; Path=/; HttpOnly`;

	return Object.assign({}, response);
}

interface User {
	uid: string;
	email: string;
	avatar: string;
}

interface Session {
	user?: User;
	locale: Locales;
}

export function getSession(request: Request): Session {
	const userDecoded = request.locals.user as adminAuth.DecodedIdToken;
	// console.log(user);

	// set the preffered language
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);
	const locale = detectLocale(acceptLanguageDetector);

	const user = userDecoded
		? ({
				uid: userDecoded.uid,
				email: userDecoded.email,
				avatar: userDecoded.picture,
		  } as User)
		: undefined;
	return {
		user: user,
		locale,
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
