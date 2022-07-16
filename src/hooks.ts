import { sequence } from '@sveltejs/kit/hooks';

import {
	attachTranslations,
	browserChecker,
	cookieParser,
	localeParser,
	userParser,
} from '$lib/server/hooks';
import { RTL_LANGS } from '$i18n/utils';
import { attachCsrfToken } from '$lib/server/csrf';
import { attachFetchGlobal } from '$lib/server/helper';

import type { Handle, RequestEvent } from '@sveltejs/kit/types/internal';

// if (dev)
attachFetchGlobal();

const pageTransformer: Handle = ({ event, resolve }) => {
	return resolve(event, {
		transformPage: ({ html }) =>
			html
				.replace('%lang%', event.locals.locale)
				.replace('%dir%', RTL_LANGS.has(event.locals.locale) ? 'rtl' : 'ltr'),
	});
};

export const handle = sequence(
	browserChecker,
	cookieParser,
	userParser,
	localeParser,
	attachTranslations,
	attachCsrfToken('/', 'csrfToken'),
	// Has to always be the last one
	pageTransformer,
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
