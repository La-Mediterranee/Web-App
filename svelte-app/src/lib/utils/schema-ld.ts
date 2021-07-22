import type {
	WithContext,
	LocalBusiness,
	Graph,
	WebSite,
	WebPage,
	Organization,
	FoodEstablishment,
	BreadcrumbList,
	SearchAction,
	Restaurant
} from 'schema-dts';

type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type QueryAction = SearchAction & {
	'query-input': string;
};

export interface OpeningHours {
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

export interface Business {
	readonly name: string;
	readonly url?: string;
	readonly logo?: Logo;
	/**
	 * Store/Buisness images and Product images
	 */
	readonly images?: string[];
	readonly acceptedPayments?: string[];
	readonly address?: {
		/** The country. For example, USA. You can also provide the two-letter {@link http://en.wikipedia.org/wiki/ISO_3166-1 ISO 3166-1 alpha-2 country code}. */
		addressCountry?: string;
		/** The locality in which the street address is, and which is in the region. For example, Mountain View. */
		addressLocality?: string;
		/** The region in which the locality is, and which is in the country. For example, California or another appropriate first-level {@link https://en.wikipedia.org/wiki/List_of_administrative_divisions_by_country Administrative division} */
		addressRegion?: string;
		/** The postal code. For example, 94043. */
		postalCode?: string;
		/** The post office box number for PO box addresses. */
		postOfficeBoxNumber?: string;
		/** The street address. For example, 1600 Amphitheatre Pkwy. */
		streetAddress?: string;
	};
	readonly geoLocation?: {
		latitude: number;
		longitude: number;
	};
	readonly telephone?: string;
	/** Opening Hours can be one for all days or one for every day as a Array */
	readonly openingHours?: OpeningHours | OpeningHours[];
	readonly acceptsReservations?: boolean;
}

export interface Website {
	url?: string;
	link?: string;
	description?: string;
}

const buis: Business = {
	name: 'La Mediterranee',
	url: 'https://www.willtrinken.at',
	images: [],
	/** Cash, Credit Card, Cryptocurrency, Local Exchange Tradings System, etc. */
	acceptedPayments: ['Cash', 'Credit Card', 'Debit Card'],
	openingHours: {
		days: 'Monday',
		opens: '12:00',
		closes: '24:00'
	}
};

const web: Website = {
	url: 'https://www.willtrinken.at',
	link: 'willtrinken.at',
	description: 'willtrinken'
};

export function websiteSchema(website: Website, buisness: Business): Graph {
	const localBusiness: LocalBusiness | Organization | FoodEstablishment | Restaurant = {
		'@type': 'LocalBusiness',
		'@id': `${buisness.url}/#organization`,
		name: buisness.name,
		url: `${buisness.url}/`,
		sameAs: [],
		logo: {
			'@type': 'ImageObject',
			'@id': `${buisness.url}/#logo`,
			inLanguage: buisness.logo?.language,
			url: buisness.logo?.url,
			contentUrl: buisness.logo?.url,
			width: `${buisness.logo?.width}`,
			height: `${buisness.logo?.height}`,
			caption: buisness.name
		},
		address: {
			'@type': 'PostalAddress',
			addressCountry: buisness.address?.addressCountry,
			streetAddress: buisness.address?.streetAddress,
			addressLocality: buisness.address?.addressLocality,
			addressRegion: buisness.address?.addressRegion,
			postalCode: buisness.address?.postalCode
		},
		paymentAccepted: buisness.acceptedPayments?.join(', '),
		image: buisness.images
	};

	const EXPLORE_ACTION: QueryAction = {
		'@type': 'SearchAction',
		'@id': `${website.url}/explore`,
		target: `${website.url}/explore/results?q={search_term_string}`,
		'query-input': 'required name=search_term_string'
	};

	const _website: WebSite = {
		'@type': 'WebSite',
		'@id': 'https://www.willtrinken.at/#website',
		url: website.url,
		name: website.link,
		description: website.description,
		publisher: {
			'@id': 'https://www.willtrinken.at/#organization'
		},
		potentialAction: [EXPLORE_ACTION],
		inLanguage: 'de-DE'
	};

	const _webpage: WebPage = {
		'@type': 'WebPage',
		'@id': 'https://www.willtrinken.at/#webpage',
		url: 'https://www.willtrinken.at/',
		name: 'Getr\u00e4nke Lieferung - willtrinken.at',
		isPartOf: {
			'@id': 'https://www.willtrinken.at/#website'
		},
		about: {
			'@id': 'https://www.willtrinken.at/#organization'
		},
		datePublished: '2020-11-15T11:37:01+00:00',
		dateModified: '2021-07-12T13:47:24+00:00',
		description:
			'Getr\u00e4nke Lieferung. Getr\u00e4nke online bestellen bei willtrinken.at. Lieferservice f\u00fcr Getr\u00e4nke und mehr.',
		breadcrumb: {
			'@id': 'https://www.willtrinken.at/#breadcrumb'
		},
		inLanguage: 'de-DE',
		potentialAction: [
			{
				'@type': 'ReadAction',
				target: ['https://www.willtrinken.at/']
			}
		]
	};

	const breadcrumb: BreadcrumbList = {
		'@type': 'BreadcrumbList',
		'@id': 'https://www.willtrinken.at/#breadcrumb',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				item: {
					'@id': 'https://www.willtrinken.at/#webpage'
				}
			}
		]
	};

	return {
		'@context': 'https://schema.org',
		'@graph': [localBusiness, _website, _webpage]
	};
}
