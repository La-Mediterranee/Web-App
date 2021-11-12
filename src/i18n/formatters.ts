import type { AsyncFormattersInitializer } from 'typesafe-i18n';
import type { Locales, Formatters } from './i18n-types';

export const initFormatters: AsyncFormattersInitializer<Locales, Formatters> = async (locale: Locales) => {
	const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });

	const formatters: Formatters = {
		uppercase: (value: string) => value.toUpperCase(),
		weekday: (value: number | Date) => dateFormatter.format(value),
	};

	return formatters;
};
