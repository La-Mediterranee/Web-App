import type { WithContext, Graph, WebSite, WebPage, BreadcrumbList, Restaurant, Product, MenuItem } from 'schema-dts';

import type { Business, MenuItemProduct, QueryAction, Website } from './schema-ld.types';

const buis: Business = {
	name: 'La Mediterranee',
	url: 'https://www.willtrinken.at',
	images: [],
	// photo: {

	// }
	/** Cash, Credit Card, Cryptocurrency, Local Exchange Tradings System, etc. */
	acceptedPayments: ['Cash', 'Credit Card', 'Debit Card'],
	openingHours: {
		days: 'Monday',
		opens: '12:00',
		closes: '24:00',
	},
};

const web: Website = {
	url: 'https://www.willtrinken.at',
	link: 'willtrinken.at',
	description: 'willtrinken',
};

export function websiteSchema(website: Website, buisness: Business): Graph {
	const restaurant: WithContext<Restaurant> = {
		'@context': 'https://schema.org',
		'@type': 'Restaurant', // LocalBusiness, FoodEstablishment
		'@id': `${buisness.url}`,
		name: buisness.name,
		url: buisness.url,
		telephone: buisness.telephone,
		address: {
			'@type': 'PostalAddress',
			addressCountry: buisness.address?.addressCountry || 'AT',
			streetAddress: buisness.address?.streetAddress,
			addressLocality: buisness.address?.addressLocality || 'Wien',
			postalCode: buisness.address?.postalCode || '1120',
		},
		// photo: ,
		publicAccess: true,
		email: buisness.email,
		image: buisness.images,
		logo: {
			'@type': 'ImageObject',
			'@id': `${buisness.url}/#logo`,
			inLanguage: buisness.logo?.language,
			url: buisness.logo?.url,
			contentUrl: buisness.logo?.url,
			width: `${buisness.logo?.width}`,
			height: `${buisness.logo?.height}`,
			caption: buisness.name,
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: buisness.geoLocation?.latitude,
			longitude: buisness.geoLocation?.longitude,
		},
		slogan: buisness.slogan,
		smokingAllowed: buisness.smokingAllowed,
		menu: buisness.url,
		servesCuisine: buisness.cuisines || ['Italian', 'Breakfast', 'Turkish', 'Pizza'],
		paymentAccepted: buisness.acceptedPayments?.join(', '),
		currenciesAccepted: 'EUR',
		priceRange: '€€',
		legalName: '',
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: 4.1,
			ratingCount: 10216,
			bestRating: 5,
			worstRating: 1,
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				opens: '07:00',
				closes: '23:59',
			},
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				opens: '00:00',
				closes: '02:00',
			},
		],
		potentialAction: {
			'@type': 'OrderAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${buisness.url}?utm_source=google&utm_medium=organic&utm_campaign=google_place_order_action`,
				// this line is in the spec look in https://github.com/schemaorg/schemaorg/issues/561
				//@ts-ignore
				inLanguage: 'en',
				actionPlatform: [
					'http://schema.org/DesktopWebPlatform',
					'http://schema.org/IOSPlatform',
					'http://schema.org/AndroidPlatform',
				],
			},
		},
	};

	const EXPLORE_ACTION: QueryAction = {
		'@type': 'SearchAction',
		'@id': `${website.url}/explore`,
		target: `${website.url}/explore/results?q={search_term_string}`,
		'query-input': 'required name=search_term_string',
	};

	const _website: WebSite = {
		'@type': 'WebSite',
		'@id': `${buisness.url}/#website`,
		url: website.url,
		name: website.link,
		description: website.description,
		publisher: {
			'@id': `${buisness.url}/#organization`,
		},
		potentialAction: [EXPLORE_ACTION],
		inLanguage: 'de-DE',
	};

	const _webpage: WebPage = {
		'@type': 'WebPage',
		'@id': 'https://www.willtrinken.at/#webpage',
		url: 'https://www.willtrinken.at/',
		name: 'Getr\u00e4nke Lieferung - willtrinken.at',
		isPartOf: {
			'@id': 'https://www.willtrinken.at/#website',
		},
		about: {
			'@id': 'https://www.willtrinken.at/#organization',
		},
		datePublished: '2020-11-15T11:37:01+00:00',
		dateModified: '2021-07-12T13:47:24+00:00',
		description:
			'Getr\u00e4nke Lieferung. Getr\u00e4nke online bestellen bei willtrinken.at. Lieferservice f\u00fcr Getr\u00e4nke und mehr.',
		breadcrumb: {
			'@id': 'https://www.willtrinken.at/#breadcrumb',
		},
		inLanguage: 'de-DE',
		potentialAction: [
			{
				'@type': 'ReadAction',
				target: ['https://www.willtrinken.at/'],
			},
		],
	};

	const p: MenuItemProduct = {
		'@type': ['Product', 'MenuItem'],
	};

	const breadcrumb: BreadcrumbList = {
		'@type': 'BreadcrumbList',
		'@id': 'https://www.willtrinken.at/#breadcrumb',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				item: {
					'@id': 'https://www.willtrinken.at/#webpage',
				},
			},
		],
	};

	return {
		'@context': 'https://schema.org',
		'@graph': [restaurant, _website, _webpage],
	};
}

// const localBusiness: LocalBusiness | Organization | FoodEstablishment | Restaurant = {
// 	'@type': 'LocalBusiness',
// 	'@id': `${buisness.url}/#organization`,
// 	name: buisness.name,
// 	url: `${buisness.url}/`,
// 	sameAs: [],
// 	logo: {
// 		'@type': 'ImageObject',
// 		'@id': `${buisness.url}/#logo`,
// 		inLanguage: buisness.logo?.language,
// 		url: buisness.logo?.url,
// 		contentUrl: buisness.logo?.url,
// 		width: `${buisness.logo?.width}`,
// 		height: `${buisness.logo?.height}`,
// 		caption: buisness.name,
// 	},
// 	address: {
// 		'@type': 'PostalAddress',
// 		addressCountry: buisness.address?.addressCountry,
// 		streetAddress: buisness.address?.streetAddress,
// 		addressLocality: buisness.address?.addressLocality,
// 		addressRegion: buisness.address?.addressRegion,
// 		postalCode: buisness.address?.postalCode,
// 	},
// 	paymentAccepted: buisness.acceptedPayments?.join(', '),
// 	image: buisness.images,
// };
