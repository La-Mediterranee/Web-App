import jwt_decode from 'jwt-decode';

import { sequence } from '@sveltejs/kit/hooks';

import { RTL_LANGS } from '$i18n/utils';
import { baseLocale, detectLocale } from '$i18n/i18n-util';

import { parse } from '$lib/server/cookie';
import { auth } from '$lib/server/firebase';
import { refreshSessionCookie, setCookie } from '$lib/server/helper';
import { attachCsrfToken } from '$lib/server/csrf';

import type { AuthError } from 'firebase/auth';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import type { Locale } from 'typesafe-i18n/types/core';
import type { LocaleDetector } from 'typesafe-i18n/detectors';
import type { BaseLocale } from '$i18n/i18n-types';

const REGEX_ACCEPT_LANGUAGE_SPLIT = /;|,/;

export const initAcceptLanguageHeaderDetector =
	(request: Request, headerKey = 'accept-language'): LocaleDetector =>
	(): Locale[] =>
		(request.headers.get(headerKey) as string)
			?.split(REGEX_ACCEPT_LANGUAGE_SPLIT)
			.filter(part => !part.startsWith('q'))
			.map(part => part.trim())
			.filter(part => part !== '*')
			.filter(value => value !== '') || [];

function initRequestCookiesDetector(request: Request, headerKey = 'pref-locale'): LocaleDetector {
	const prefLang = request.headers.get(headerKey);
	return () => (prefLang ? [prefLang] : []);
}

function initCustomClaims(event: RequestEvent): LocaleDetector {
	const locale = event.locals.user?.locale;
	return () => (locale ? [locale] : []);
}

const parseLocale: Handle = async ({ event, resolve }) => {
	if (!event.locals.locale) {
		// set the preffered language
		const customClaims = initCustomClaims(event);
		const requestCookies = initRequestCookiesDetector(event.request);
		const acceptLanguageDetector = initAcceptLanguageHeaderDetector(event.request);

		event.locals.locale = detectLocale(customClaims, requestCookies, acceptLanguageDetector);
	}

	return resolve(event);
};

const cookieParser: Handle = async ({ event, resolve }) => {
	const cookies = parse<Cookies>(event.request.headers.get('cookie') || '');

	event.locals.cookies = cookies;

	console.log('parsing cookies');

	return resolve(event);
};

const browserChecker: Handle = async ({ resolve, event }) => {
	const unSupportedBrowsers = ['MSIE.*', 'Trident.*'];

	// check for unsupported browsers
	if (
		/MSIE \d|Trident.*rv:/.test(event.request.headers.get('user-agent') || '') &&
		!event.url.pathname.includes('unsupported')
	) {
		return new Response(null, {
			status: 301,
			headers: {
				location: `/unsupported`,
			},
		});
	}

	const response = await resolve(event);

	return response;
};

const parseUser: Handle = async ({ event, resolve }) => {
	try {
		const sessionId = event.locals.cookies.sessionId;
		if (sessionId) {
			// console.log('JWT:', jwt_decode(cookies.session, { header: true }));
			event.locals.user = await auth.verifySessionCookie(sessionId);
		}
	} catch (_e) {
		const err = _e as AuthError;
		console.error(`parseUser() -> ${err.code}: ${err.message}`);
		event.locals.user = null;
	}

	const response = await resolve(event);

	console.log(response.status);

	if (event.locals.user) {
		const expiration = new Date(1970, 0, 1).setSeconds(event.locals.user.exp);
		const current = Date.now();

		if (Math.abs(expiration - current) / 36e5 <= 24) {
			const days = 14;
			const expiresIn = days * 60 * 60 * 24 * 1000;

			const newCookie = await refreshSessionCookie(event.locals.user.uid, expiresIn);

			setCookie(response, 'sessionId', newCookie, {
				maxAge: expiresIn / 1000,
				httpOnly: true,
				secure: true,
				path: '/',
				// domain: ".",
			});
		}
	}

	return response;
};

export const handle = sequence(
	browserChecker,
	cookieParser,
	parseUser,
	parseLocale,
	attachCsrfToken('/', 'csrfToken'),
);

export async function getSession(event: RequestEvent): Promise<App.Session> {
	return {
		user: getUser(event.locals),
		locale: event.locals.locale,
		//@ts-ignore
		urlLocale:
			event.locals.locale !== baseLocale
				? '/' + (event.locals.locale as Exclude<Locales, BaseLocale>)
				: '',
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
