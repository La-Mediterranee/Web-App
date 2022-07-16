import { i18n } from '$i18n/i18n-util';
import { loadAllLocales } from '$i18n/i18n-util.sync';
import type { Handle } from '@sveltejs/kit';

loadAllLocales();
const LL = i18n();

export const attachTranslations: Handle = async ({ event, resolve }) => {
	event.locals.LL = LL[event.locals.locale];
	return resolve(event);
};
