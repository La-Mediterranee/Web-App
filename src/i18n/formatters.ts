import { date, ignore, lowercase as lower, uppercase as upper } from 'typesafe-i18n/formatters';

import type { FormattersInitializer } from 'typesafe-i18n';
import type { Locales, Formatters } from './i18n-types';

export const initFormatters: FormattersInitializer<Locales, Formatters> = async (
	locale: Locales,
) => {
	const formatters: Formatters = {
		uppercase: upper,
		lowercase: lower,
		weekday: date(locale, { weekday: 'long' }),
		simpleDate: date(locale, { day: '2-digit', month: 'short', year: 'numeric' }),
	};

	return formatters;
};
