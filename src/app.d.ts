/// <reference types="@sveltejs/kit" />

type Locales = import('$i18n/i18n-types').Locales;
type DecodedIdToken = import('firebase-admin/auth').DecodedIdToken;
type FirebaseUser = import('firebase/auth').User;

interface Cookies {
	'sessionId': string;
	'csrfToken': string;
	'pref-locale': Locales;
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
		urlLocale: Exclude<Locales, import('./i18n/i18n-types').BaseLocale> | '';
	}

	interface Platform {}

	interface Session {
		user?: User;
		locale: Locales;
		urlLocale: Exclude<Locales, import('./i18n/i18n-types').BaseLocale> | '';
		rtl: boolean;
	}

	interface Stuff {
		locale: Locales;
		activeRoute?: string;
	}
}
