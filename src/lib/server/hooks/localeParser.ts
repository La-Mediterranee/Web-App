import { RTL_LANGS } from '$i18n/utils';
import { baseLocale, detectLocale } from '$i18n/i18n-util';

import type { Locale } from 'typesafe-i18n/types/core';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import type { LocaleDetector } from 'typesafe-i18n/detectors';

import type { BaseLocale } from '$i18n/i18n-types';

const REGEX_ACCEPT_LANGUAGE_SPLIT = /;|,/;

function initAcceptLanguageHeaderDetector(
	request: Request,
	headerKey = 'accept-language',
): LocaleDetector {
	const locales = request.headers.get(headerKey) as string;
	return (): Locale[] =>
		locales
			?.split(REGEX_ACCEPT_LANGUAGE_SPLIT)
			.filter(part => !part.startsWith('q'))
			.map(part => part.trim())
			.filter(part => part !== '*')
			.filter(value => value !== '') || [];
}

// export const initAcceptLanguageHeaderDetector =
// 	(request: Request, headerKey = 'accept-language'): LocaleDetector =>
// 	(): Locale[] =>
// 		(request.headers.get(headerKey) as string)
// 			?.split(REGEX_ACCEPT_LANGUAGE_SPLIT)
// 			.filter(part => !part.startsWith('q'))
// 			.map(part => part.trim())
// 			.filter(part => part !== '*')
// 			.filter(value => value !== '') || [];

function initRequestCookiesDetector(request: Request, headerKey = 'pref-locale'): LocaleDetector {
	const prefLang = request.headers.get(headerKey);
	return (): Locale[] => (prefLang ? [prefLang] : []);
}

function initCustomClaims(event: RequestEvent): LocaleDetector {
	const locale = event.locals.user?.locale;
	return (): Locale[] => (locale ? [locale] : []);
}

export const localeParser: Handle = async ({ event, resolve }) => {
	// set the preffered language
	const customClaims = initCustomClaims(event);
	const requestCookies = initRequestCookiesDetector(event.request);
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(event.request);

	event.locals.locale = detectLocale(customClaims, requestCookies, acceptLanguageDetector);

	event.locals.urlLocale =
		event.locals.locale !== baseLocale
			? <UrlLocale>('/' + (event.locals.locale as Exclude<Locales, BaseLocale>))
			: '';
	return resolve(event);
};
