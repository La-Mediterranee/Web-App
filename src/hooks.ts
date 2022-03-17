import jwt_decode from 'jwt-decode';

import { sequence } from '@sveltejs/kit/hooks';

import { RTL_LANGS } from '$i18n/utils';
import { baseLocale, detectLocale } from '$i18n/i18n-util';

import { parse } from '$lib/server/cookie';
import { auth } from '$lib/server/firebase';
import { refreshSessionCookie, setCookie } from '$lib/server/helper';
import { attachCsrfToken } from '$lib/server/csrf';

import type { AuthError } from 'firebase/auth';
import type { Locale } from 'typesafe-i18n/types/core';
import type { LocaleDetector } from 'typesafe-i18n/detectors';
import type { Handle, RequestEvent } from '@sveltejs/kit/types/internal';

import type { BaseLocale } from '$i18n/i18n-types';
import { dev } from '$app/env';
import { SERVER_PORT } from '$lib/utils/constants';

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

	//@ts-ignore
	event.locals.urlLocale =
		event.locals.locale !== baseLocale
			? '/' + (event.locals.locale as Exclude<Locales, BaseLocale>)
			: '';
	return resolve(event);
};

const cookieParser: Handle = async ({ event, resolve }) => {
	const cookies = parse<Cookies>(event.request.headers.get('cookie') || '');

	event.locals.cookies = cookies;

	const response = await resolve(event);

	return response;
};

const animation =
	'linear-gradient(to right, rgb(244, 244, 244) 8%, rgb(204, 204, 204) 18%, rgb(244, 244, 244) 33%) 0% 0% / 1000px 104px rgb(244, 244, 244);';

const s = `
	.loading:after {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		content: "";
		background-image: linear-gradient(90deg,hsla(0,0%,100%,0),hsla(0,0%,100%,0.2) 20%,hsla(0,0%,100%,0.5) 60%,hsla(0,0%,100%,0));
		animation: loading-gradient 1s infinite;
		transform: translateX(-100%);
	}`;

const ani = `
@keyframes loading-gradient { 
	100% { 
		transform: translateX(100%);
	}
}`;

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

async function verifySessionCookie(token: JwtToken) {
	return fetch(`http://localhost:${SERVER_PORT}/v1/auth/session/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain' },
		body: token,
	}).then(res => res.json());
}

const parseUser: Handle = async ({ event, resolve }) => {
	try {
		const sessionId = event.locals.cookies.sessionId;
		if (sessionId) {
			// console.log('JWT:', jwt_decode(cookies.session, { header: true }));
			// event.locals.user = await auth.verifySessionCookie(sessionId);
			event.locals.user = await verifySessionCookie(sessionId);
		}
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
		urlLocale: event.locals.urlLocale,
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
