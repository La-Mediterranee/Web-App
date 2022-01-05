import { sequence } from '@sveltejs/kit/hooks';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

import { RTL_LANGS } from '$i18n/utils';
import { detectLocale } from '$i18n/i18n-util';

import { parse } from './server/cookie';
import { auth } from './server/firebase';
import { attachCsrfToken } from './server/csrf';

import type { Locales } from '$i18n/i18n-types';
import type { Request, Handle } from '@sveltejs/kit';
import type { DecodedIdToken } from 'firebase-admin/auth';

interface Cookies {
	'session': string;
	'preferred-lang': string;
	'csrfToken': string;
}

interface AppLocals<T> {
	user?: DecodedIdToken;
	cookies: T;
}

export type ShopLocals = AppLocals<Cookies>;
export type ShopHookRequest = Request<ShopLocals, Body>;

const cookieParser: Handle = async ({ request, resolve }) => {
	const cookies = parse<Cookies>(request.headers.cookie || '');

	request.locals.cookies = cookies;

	return resolve(request);
};

const methodResolver: Handle = async ({ request, resolve }) => {
	// TODO https://github.com/sveltejs/kit/issues/1046
	const method = request.url.searchParams.get('_method');

	if (method) {
		request.method = method.toUpperCase();
	}

	return resolve(request);
};

const last: Handle = async ({ request, resolve }) => {
	const cookies = request.locals.cookies;

	try {
		request.locals.user = await auth.verifySessionCookie(cookies.session);
	} catch (_) {
		request.locals.user = undefined;
	}

	const response = await resolve(request);

	return Object.assign({}, response);
};

const browserChecker: Handle = async ({ resolve, request }) => {
	const unSupportedBrowsers = ['MSIE.*', 'Trident.*'];

	const lang = request.locals.lang;
	const response = await resolve(request);

	// check for unsupported browsers
	if (/MSIE \d|Trident.*rv:/.test(request.headers['user-agent'])) {
		response.headers['Location'] = `/${lang}/unsupported.html`;
	}

	return response;
};

export const handle = sequence(
	cookieParser,
	methodResolver,
	attachCsrfToken('/', 'csrfToken'),
	browserChecker,
	last
);

interface User {
	uid: string;
	email: string;
	avatar: string;
}

interface Session {
	user?: User;
	locale: Locales;
	rtl: boolean;
}

export function getSession(request: ShopHookRequest): Session {
	const userDecoded = request.locals.user;

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
		user,
		locale,
		rtl: RTL_LANGS.has(locale),
	};
}

// interface HandleProps {
// 	request: ShopHookRequest;
// 	resolve(request: ShopHookRequest): Promise<Response>;
// }

// export async function handler(input: HandleProps) {
// 	const { request, resolve } = input;

// 	const cookies = request.locals.cookies;

// 	try {
// 		request.locals.user = await auth.verifySessionCookie(cookies.session);
// 	} catch (_) {
// 		request.locals.user = undefined;
// 	}

// 	const response = await resolve(request);

// 	// check for unsupported browsers
// 	if (/MSIE \d|Trident.*rv:/.test(request.headers['user-agent'])) {
// 		response.headers['Location'] = `/${resolve}/unsupported.html`;
// 	}

// 	return Object.assign({}, response);
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
