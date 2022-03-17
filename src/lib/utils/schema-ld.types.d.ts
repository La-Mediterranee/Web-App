import type { MenuItem, Photograph, Product, SearchAction } from 'schema-dts';

type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type QueryAction = SearchAction & {
	'query-input': string;
};

type CombinedSchemaTypes = 'Product' | 'MenuItem';

type MenuItemProduct = Partial<Omit<Product, '@type'>> &
	Partial<Omit<MenuItem, '@type'>> & {
		'@type': CombinedSchemaTypes[];
	};

interface OpeningHours {
	days: Weekday | Weekday[];
	/** Uses the 24 Hour system. Always Provide 4 digets for example '12:00'. For 24 Hours openings set opens to '00:00' and closes to '23:59' */
	opens: string;
	/** Uses the 24 Hour system. Always Provide 4 digets for example '12:00'. For 24 Hours openings set opens to '00:00' and closes to '23:59' */
	closes: string;
	validFrom?: string;
	validThrough?: string;
}

interface Logo {
	url?: string;
	width?: string | number;
	height?: string | number;
	language?: string;
}

interface Business {
	readonly name: string;
	readonly url?: string;
	readonly logo?: Logo;
	readonly email?: string;
	readonly cuisines?: readonly string[];
	/**
	 * Store/Buisness images and Product images
	 */
	readonly images?: readonly string[];
	readonly acceptedPayments?: readonly string[];
	readonly address?: {
		/** The country. For example, USA. You can also provide the two-letter {@link http://en.wikipedia.org/wiki/ISO_3166-1 ISO 3166-1 alpha-2 country code}. */
		readonly addressCountry?: string;
		/** The locality in which the street address is, and which is in the region. For example, Mountain View. */
		readonly addressLocality?: string;
		/** The region in which the locality is, and which is in the country. For example, California or another appropriate first-level {@link https://en.wikipedia.org/wiki/List_of_administrative_divisions_by_country Administrative division} */
		readonly addressRegion?: string;
		/** The postal code. For example, 94043. */
		readonly postalCode?: string;
		/** The post office box number for PO box addresses. */
		readonly postOfficeBoxNumber?: string;
		/** The street address. For example, 1600 Amphitheatre Pkwy. */
		readonly streetAddress?: string;
	};
	readonly geoLocation?: {
		latitude: number;
		longitude: number;
	};
	readonly telephone?: string;
	/** Opening Hours can be one for all days or one for every day as a Array */
	readonly openingHours?: OpeningHours | readonly OpeningHours[];
	readonly acceptsReservations?: boolean;
	readonly legalName?: string;
	readonly slogan?: string;
	readonly smokingAllowed?: boolean;
	readonly photo?: Photograph;
}

interface Website {
	readonly url?: string;
	readonly link?: string;
	readonly description?: string;
}
