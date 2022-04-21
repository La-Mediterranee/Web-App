import { baseLocale } from '$i18n/i18n-util';
import { RTL_LANGS, locales, seti18nContext } from '$i18n/utils';
import { replaceLocaleInUrl } from '$lib/utils';

import type { ShadowEndpointOutput, RequestEvent } from '@sveltejs/kit/types/internal';
// import type { RequestHandler } from '../../.svelte-kit/types/src/routes/[...locale=locale]';

export async function get({
	locals,
	params,
	url,
}: RequestEvent<{ locale: string }>): Promise<ShadowEndpointOutput> {
	const locale = params.locale as Locales | '';
	console.log('locale called', locale);
	const session = locals;

	// redirect to preferred language if user comes from page root
	if (locale !== session.locale && session.locale !== baseLocale) {
		const path = replaceLocaleInUrl(url.pathname, `${session.urlLocale}`); //+ url.pathname; replaceLocaleInUrl(, );

		return {
			status: 302,
			headers: {
				location: path,
			},
		};
	}

	// (locale as string) !== '/' &&
	if (locale !== '' && !locales.has(locale as Locales)) {
		const path = replaceLocaleInUrl(url.pathname, `${session.urlLocale}`);

		return {
			status: 302,
			headers: {
				location: path,
			},
		};
	}

	if (session.locale === 'de' && locale !== '') {
		const path = replaceLocaleInUrl(url.pathname, '');
		console.log('third');

		return {
			status: 302,
			headers: {
				location: path,
			},
		};
	}

	return {
		body: {
			lang: session.locale,
			urlLocale: session.urlLocale,
			dir: RTL_LANGS.has(locale) ? 'rtl' : 'ltr',
		},
	};
}
