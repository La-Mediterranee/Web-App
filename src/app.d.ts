/// <reference types="@sveltejs/kit" />

interface Cookies {
	'sessionId': string;
	'csrfToken': string;
	'pref-locale': string;
}

interface User {
	uid: string;
	email: string;
	photoURL: string;
	displayName: string;
}

declare namespace App {
	interface Locals {
		user?: import('firebase-admin/auth').DecodedIdToken | null;
		cookies: Cookies;
		locale: import('$i18n/i18n-types').Locales;
	}

	interface Platform {}

	interface Session {
		user?: User;
		locale: import('$i18n/i18n-types').Locales;
		rtl: boolean;
	}

	interface Stuff {}
}
