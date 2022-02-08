import jwt_decode from 'jwt-decode';

import { sequence } from '@sveltejs/kit/hooks';
// import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

import { RTL_LANGS } from '$i18n/utils';
import { detectLocale } from '$i18n/i18n-util';

import { parse } from '$lib/server/cookie';
import { auth } from '$lib/server/firebase';
import { attachCsrfToken } from '$lib/server/csrf';

import type { Handle, RequestEvent } from '@sveltejs/kit';
import type { Locale } from 'typesafe-i18n/types/core';
import type { LocaleDetector } from 'typesafe-i18n/detectors';

const cookieParser: Handle = async ({ event, resolve }) => {
	const cookies = parse<Cookies>(event.request.headers.get('cookie') || '');

	event.locals.cookies = cookies;

	return resolve(event);
};

const browserChecker: Handle = async ({ resolve, event }) => {
	const unSupportedBrowsers = ['MSIE.*', 'Trident.*'];

	const lang = event.locals.lang;
	const response = await resolve(event);

	// check for unsupported browsers
	if (/MSIE \d|Trident.*rv:/.test(event.request.headers.get('user-agent') || '')) {
		response.headers.set('Location', `/${lang}/unsupported.html`);
	}

	return response;
};

const last: Handle = async ({ event, resolve }) => {
	const cookies = event.locals.cookies as Cookies;
	event.locals.locale = cookies['pref-locale'];

	try {
		event.locals.user = await auth.verifySessionCookie(cookies.sessionId);
	} catch (err) {
		console.error(err);
		event.locals.user = null;
	}

	try {
		// console.log('JWT:', jwt_decode(cookies.session, { header: true }));
	} catch (error) {
		console.error(error);
	}

	const response = await resolve(event);

	return response;
};

export const handle = sequence(
	cookieParser,
	attachCsrfToken('/', 'csrfToken'),
	browserChecker,
	last,
);

// export interface User {
// 	uid: string;
// 	email: string;
// 	photoURL: string;
// 	displayName: string;
// }

const REGEX_ACCEPT_LANGUAGE_SPLIT = /;|,/;

export const initAcceptLanguageHeaderDetector =
	(headers: Headers, headerKey = 'accept-language'): LocaleDetector =>
	(): Locale[] =>
		(headers.get(headerKey) as string)
			?.split(REGEX_ACCEPT_LANGUAGE_SPLIT)
			.filter(part => !part.startsWith('q'))
			.map(part => part.trim())
			.filter(part => part !== '*')
			.filter(value => value === '') || [];

export function getSession(event: RequestEvent<App.Locals>): App.Session {
	if (!event.locals.locale) {
		// set the preffered language
		const acceptLanguageDetector = initAcceptLanguageHeaderDetector(event.request.headers);
		event.locals.locale = detectLocale(acceptLanguageDetector);
	}

	return {
		user: getUser(event.locals),
		locale: event.locals.locale,
		rtl: RTL_LANGS.has(event.locals.locale),
	};
}

function getUser(locals: App.Locals) {
	const user = locals.user;
	if (!user) return;

	return {
		uid: user.uid,
		email: user.email,
		photoURL: user.picture,
		displayName: user.name,
	} as User;
}

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
