import { getContext, setContext } from 'svelte';
import { initI18nSvelte, type SvelteStoreInit } from 'typesafe-i18n/svelte';
import { loadedFormatters, loadedLocales, locales as utilLocales } from './i18n-util';

import type { Formatters } from './i18n-types';
import type { Readable } from 'svelte/store';

export const RTL_LANGS = new Set([
	'ae' /* Avestan */,
	'ar' /* 'العربية', Arabic */,
	'arc' /* Aramaic */,
	'bcc' /* 'بلوچی مکرانی', Southern Balochi */,
	'bqi' /* 'بختياري', Bakthiari */,
	'ckb' /* 'Soranî / کوردی', Sorani */,
	'dv' /* Dhivehi */,
	'fa' /* 'فارسی', Persian */,
	'glk' /* 'گیلکی', Gilaki */,
	'he' /* 'עברית', Hebrew */,
	'ku' /* 'Kurdî / كوردی', Kurdish */,
	'mzn' /* 'مازِرونی', Mazanderani */,
	'nqo' /* N'Ko */,
	'pnb' /* 'پنجابی', Western Punjabi */,
	'ps' /* 'پښتو', Pashto, */,
	'sd' /* 'سنڌي', Sindhi */,
	'ug' /* 'Uyghurche / ئۇيغۇرچە', Uyghur */,
	'ur' /* 'اردو', Urdu */,
	'yi' /* 'ייִדיש', Yiddish */,
]);

export const locales = new Set(utilLocales);

interface LocaleConfig {
	numberingSystem: Intl.LocaleOptions['numberingSystem'];
}

export const intlConfig: Record<Locales, LocaleConfig> = Object.freeze({
	ar: {
		numberingSystem: 'arab',
	},
	de: {
		numberingSystem: undefined,
	},
	en: {
		numberingSystem: undefined,
	},
});

const LL_KEY = Symbol('i18n');

type i18nStore = SvelteStoreInit<Locales, Translations, TranslationFunctions>;

// self.addEventListener("languagechange")

export function seti18nContext(): i18nStore {
	const i18n = initI18nSvelte<Locales, Translations, TranslationFunctions, Formatters>(
		loadedLocales,
		loadedFormatters,
	);
	setContext(LL_KEY, i18n);
	return i18n;
}

export function geti18nContext(): i18nStore {
	return getContext(LL_KEY);
}

export const LL: Readable<TranslationFunctions> = {
	subscribe(fn) {
		return geti18nContext().LL.subscribe(fn);
	},
};

export function setLocale(locale: Locales) {
	geti18nContext().setLocale(locale);
}
