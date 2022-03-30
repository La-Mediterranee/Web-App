/// <reference types="@sveltejs/kit" />

type Locales = import('$i18n/i18n-types').Locales;
type Translations = import('$i18n/i18n-types').Translations;
type TranslationFunctions = import('$i18n/i18n-types').TranslationFunctions;

type DecodedIdToken = import('firebase-admin/auth').DecodedIdToken;
type FirebaseUser = import('firebase/auth').User;
type UrlLocale = `/${Exclude<Locales, import('./i18n/i18n-types').BaseLocale>}` | '';

interface Cookies {
	'sessionId': JwtToken;
	'csrfToken': string;
	'pref-locale': Locales;
	'intentSecret'?: string;
}

interface User extends FirebaseUser {
	uid: string;
	email: string;
	photoURL: string;
	displayName: string;
}

declare namespace App {
	interface Locals {
		user?: DecodedIdToken | null;
		cookies: Cookies;
		locale: Locales;
		urlLocale: UrlLocale;
		LL: TranslationFunctions;
	}

	interface Platform {}

	interface Session {
		user?: User;
		locale: Locales;
		urlLocale: UrlLocale;
		rtl: boolean;
	}

	interface Stuff {
		locale: Locales;
		activeRoute?: string;
	}
}
