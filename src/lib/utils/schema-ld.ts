import type {
	WithContext,
	Graph,
	WebSite,
	WebPage,
	BreadcrumbList,
	Restaurant,
	Menu,
} from 'schema-dts';

import type { Business, MenuItemProduct, QueryAction, Website } from './schema-ld.types';

const web: Website = {
	url: 'https://www.la-mediterranee.at',
	link: 'la-mediterranee.at',
	description: '',
};

const e = {
	'@context': 'http://schema.org',
	'@type': 'Organization',
	'name': 'MediaMarkt',
	'url': 'https://www.mediamarkt.at/',
	'logo': 'https://assets.mmsrg.com/is/166325/12975367df8e182e57044734f5165e190/c3/-/abf3d0567b8824b57828926082859f66d?version=0&x=300&y=40&format=jpg',
	'foundingDate': '1979-11-24',
	'contactPoint': {
		'@type': 'ContactPoint',
		'contactType': 'Kontakt',
		'email': 'kundenservice@mediamarkt.at',
	},
	'potentialAction': {
		'@type': 'SearchAction',
		'target': 'https://www.mediamarkt.at/de/search.html?query={search_term_string}',
		'query-input': 'required name=search_term_string',
	},
};

const restaurantExample: Restaurant = {
	'@type': 'Restaurant',
	'hasMenu': [
		{
			'@type': 'Menu',
			'name': 'Breakfast',
			'url': 'https://your-restaurant.com/breakfast-menu/',
		},
		{
			'@type': 'Menu',
			'name': 'Lunch',
			'url': 'https://your-restaurant.com/lunch-menu/',
		},
		{
			'@type': 'Menu',
			'name': 'Dinner',
			'url': 'https://your-restaurant.com/dinner-menu/',
		},
	],
};

const menuExample: Menu = {
	'@type': 'Menu',
	'name': 'Our Menu',
	'mainEntityOfPage': 'https://your-restaurant.com/menu/',
	'inLanguage': 'English',
	// time limited menu
	'offers': {
		'@type': 'Offer',
		'availabilityStarts': 'T17:00',
		'availabilityEnds': 'T23:00',
	},
	'hasMenuSection': [
		{
			'@type': 'MenuSection',
			'name': 'Appetizers',
			'hasMenuItem': [
				{
					'@type': 'MenuItem',
					'name': 'Fried Eggplant',
					'description': 'Served with Italian red gravy.',
					'offers': {
						'@type': 'Offer',
						'price': '7.95',
						'priceCurrency': 'USD',
					},
				},
				{
					'@type': 'MenuItem',
					'name': 'Fried Calamari',
					'description': 'Served with Italian red gravy or honey mustard.',
					'image': 'https://your-restaurant.com/images/fried-calamari.jpg',
					'suitableForDiet': 'https://schema.org/GlutenFreeDiet',
					'nutrition': {
						'@type': 'NutritionInformation',
						'calories': '573 calories',
						'fatContent': '25 grams',
						'carbohydrateContent': '26 grams',
						'proteinContent': '61 grams',
					},
					'offers': {
						'@type': 'Offer',
						'price': '7.95',
						'priceCurrency': 'USD',
					},
				},
			],
		},
		{
			'@type': 'MenuSection',
			'name': 'Soups',
			'hasMenuItem': [
				{
					'@type': 'MenuItem',
					'name': 'Lobster Bisque',
					'offers': [
						{
							'@type': 'Offer',
							'price': '6.75',
							'priceCurrency': 'USD',
							'eligibleQuantity': {
								'@type': 'QuantitativeValue',
								'name': 'Cup',
							},
						},
						{
							'@type': 'Offer',
							'price': '9.95',
							'priceCurrency': 'USD',
							'eligibleQuantity': {
								'@type': 'QuantitativeValue',
								'name': 'Bowl',
							},
						},
					],
				},
				{
					'@type': 'MenuItem',
					'name': 'Creole Seafood Gumbo',
					'offers': [
						{
							'@type': 'Offer',
							'price': '6.75',
							'priceCurrency': 'USD',
							'eligibleQuantity': {
								'@type': 'QuantitativeValue',
								'name': 'Cup',
							},
						},
						{
							'@type': 'Offer',
							'name': 'Bowl',
							'price': '9.95',
							'priceCurrency': 'USD',
							'eligibleQuantity': {
								'@type': 'QuantitativeValue',
								'name': 'Bowl',
							},
						},
					],
				},
			],
		},
	],
};

export function websiteSchema(website: Website, buisness: Business): Graph {
	const restaurant: WithContext<Restaurant> = {
		'@context': 'https://schema.org',
		'@type': 'Restaurant', // LocalBusiness, FoodEstablishment
		'@id': `${buisness.url}`,
		'name': buisness.name,
		'url': buisness.url,
		'telephone': buisness.telephone,
		'address': {
			'@type': 'PostalAddress',
			'addressCountry': buisness.address?.addressCountry,
			'streetAddress': buisness.address?.street,
			'addressLocality': buisness.address?.addressLocality,
			'postalCode': buisness.address?.postalCode,
		},
		// photo: ,
		'publicAccess': true,
		'email': buisness.email,
		'image': buisness.images,
		'logo': {
			'@type': 'ImageObject',
			'@id': `${buisness.url}/#logo`,
			'inLanguage': buisness.logo?.language,
			'url': buisness.logo?.url,
			'contentUrl': buisness.logo?.url,
			'width': `${buisness.logo?.width}`,
			'height': `${buisness.logo?.height}`,
			'caption': buisness.name,
		},
		'geo': {
			'@type': 'GeoCoordinates',
			'latitude': buisness.geoLocation?.latitude,
			'longitude': buisness.geoLocation?.longitude,
		},
		'slogan': buisness.slogan,
		'smokingAllowed': buisness.smokingAllowed,
		'menu': buisness.url,
		'servesCuisine': buisness.cuisines || ['Italian', 'Breakfast', 'Turkish', 'Pizza'],
		'paymentAccepted': buisness.acceptedPayments?.join(', '),
		'currenciesAccepted': buisness.accptedCurrencies,
		'priceRange': '€€',
		'legalName': '',
		'aggregateRating': {
			'@type': 'AggregateRating',
			'ratingValue': 4.1,
			'ratingCount': 10216,
			'bestRating': 5,
			'worstRating': 1,
		},
		'openingHoursSpecification': !(buisness.openingHours instanceof Array)
			? {
					'@type': 'OpeningHoursSpecification',
					'dayOfWeek': buisness.openingHours.days,
					'opens': buisness.openingHours.opens,
					'closes': buisness.openingHours.closes,
					'validFrom': buisness.openingHours.validFrom,
					'validThrough': buisness.openingHours.validThrough,
			  }
			: buisness.openingHours.map(openingHours => ({
					'@type': 'OpeningHoursSpecification',
					'dayOfWeek': openingHours.days,
					'opens': openingHours.opens,
					'closes': openingHours.closes,
					'validFrom': openingHours.validFrom,
					'validThrough': openingHours.validThrough,
			  })),
		'hasMenu': [],
		'potentialAction': {
			'@type': 'OrderAction',
			'target': {
				'@type': 'EntryPoint',
				'urlTemplate': `${buisness.url}?utm_source=google&utm_medium=organic&utm_campaign=google_place_order_action`,
				// this line is in the spec look in https://github.com/schemaorg/schemaorg/issues/561
				//@ts-ignore
				'inLanguage': 'en',
				'actionPlatform': [
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
		'target': `${website.url}/explore/results?q={search_term_string}`,
		'query-input': 'required name=search_term_string',
	};

	const _website: WebSite = {
		'@type': 'WebSite',
		'@id': `${buisness.url}/#website`,
		'url': website.url,
		'name': website.link,
		'description': website.description,
		'publisher': {
			'@id': `${buisness.url}/#organization`,
		},
		'potentialAction': [EXPLORE_ACTION],
		'inLanguage': 'de-DE',
	};

	const _webpage: WebPage = {
		'@type': 'WebPage',
		'@id': 'https://www.willtrinken.at/#webpage',
		'url': 'https://www.willtrinken.at/',
		'name': 'Getr\u00e4nke Lieferung - willtrinken.at',
		'isPartOf': {
			'@id': 'https://www.willtrinken.at/#website',
		},
		'about': {
			'@id': 'https://www.willtrinken.at/#organization',
		},
		'datePublished': '2020-11-15T11:37:01+00:00',
		'dateModified': '2021-07-12T13:47:24+00:00',
		'description':
			'Getr\u00e4nke Lieferung. Getr\u00e4nke online bestellen bei willtrinken.at. Lieferservice f\u00fcr Getr\u00e4nke und mehr.',
		'breadcrumb': {
			'@id': 'https://www.willtrinken.at/#breadcrumb',
		},
		'inLanguage': 'de-DE',
		'potentialAction': [
			{
				'@type': 'ReadAction',
				'target': ['https://www.willtrinken.at/'],
			},
		],
	};

	const p: MenuItemProduct = {
		'@type': ['Product', 'MenuItem'],
	};

	const breadcrumb: BreadcrumbList = {
		'@type': 'BreadcrumbList',
		'@id': 'https://www.willtrinken.at/#breadcrumb',
		'itemListElement': [
			{
				'@type': 'ListItem',
				'position': 1,
				'item': {
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

const buis: Business = {
	name: 'La Mediterranee',
	url: 'https://www.la-mediterranee.at',
	images: [],
	// photo: {

	// }

	/** Cash, Credit Card, Cryptocurrency, Local Exchange Tradings System, etc. */
	address: {
		street: 'Deublergasse 17',
		addressCountry: 'AT',
		postalCode: '1210',
		addressLocality: 'Wien',
	},
	acceptsReservations: true,
	smokingAllowed: true,
	acceptedPayments: ['Cash', 'Credit Card', 'Debit Card'],
	accptedCurrencies: 'EUR',
	openingHours: {
		days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		opens: '11:00',
		closes: '22:00',
	},
	cuisines: ['Middle Eastern', 'Mediterranean', 'Italian'],
};

websiteSchema({}, buis);

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

const example2 = {
	'@context': 'http://schema.org/',
	'@type': 'Restaurant',
	'name': "Acme's Bar and Grill",
	'description':
		'serves wood-fired meats and road runner served in an open kitchen featuring American Food.',
	'url': 'http://www.example.com',
	'telephone': '555-123-4567',
	'menu': [
		{
			'@type': 'Menu',
			'name': 'Dinner menu',
			'temporalCoverage': 'Tu-Sa 16:00-22:00',
			'hasMenuSection': {
				'@type': 'MenuSection',
				'name': 'Starters',
				'hasMenuItem': [
					{
						'@type': 'MenuItem',
						'name': 'Spears of Romaine',
						'description': 'Spicy caesar salad with chili croutons and parmesan',
						'nutrition': {
							'@type': 'NutritionInformation',
							'name': '*',
							'description':
								'These items fall under the consumer advisory for raw or undercooked meats or seafood. consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of food borne illness',
							'calories': '350',
						},
						'suitableForDiet': [
							{
								'@type': 'RestrictedDiet',
								'name': 'Vgetarian',
							},
							{
								'@type': 'RestrictedDiet',
								'name': 'Gluten-free',
							},
						],
						'offers': {
							'@type': 'Offer',
							'priceCurrency': 'USD',
							'price': '10',
							'addOn': [
								{
									'@type': 'Offer',
									'priceCurrency': 'USD',
									'price': '10',
									'itemOffered': {
										'@type': ['MenuItem', 'Product'], // The 'itemOffered' has to be an MTE because the expected value for 'itemOffered' is either schema.org/Product or schema.org/Service.
										'name': 'Poached salmon',
										'nutrition': {
											'@type': 'NutritionInformation',
											'name': '*',
											'description':
												'This item falls under the consumer advisory for raw or undercooked meats or seafood. consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of food borne illness',
											'calories': '350',
										},
									},
								},
								{
									'@type': 'Offer',
									'priceCurrency': 'USD',
									'price': '6',
									'itemOffered': {
										'@type': ['MenuItem', 'Product'],
										'name': 'Grilled chicken',
									},
								},
							],
						},
						'menuAddOn': {
							'@id': '#extras',
							'@type': 'MenuSection',
							'name': "Extra's",
							'hasMenuItem': [
								{
									'@type': 'MenuItem',
									'name': 'French fries',
									'offers': {
										'@type': 'Offer',
										'priceCurrency': 'USD',
										'price': '1',
									},
								},
								{
									'@type': 'MenuItem',
									'name': 'Hot vegatables',
									'offers': {
										'@type': 'Offer',
										'priceCurrency': 'USD',
										'price': '5',
									},
								},
							],
						},
					},
					{
						'@type': 'MenuItem',
						'name': 'Little Necks',
						'description': 'jalepeno clams in a bacon broth',
						'nutrition': {
							'@type': 'NutritionInformation',
							'name': '*',
							'description':
								'these items fall under the consumer advisory for raw or undercooked meats or seafood. consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of food borne illness',
							'calories': '450',
						},
						'offers': {
							'@type': 'Offer',
							'priceCurrency': 'USD',
							'price': '12',
						},
						'menuAddOn': {
							'@id': '#extras',
						},
					},
				],
			},
		},
		{
			'@type': 'Menu',
			'name': 'Brunch menu',
			'temporalCoverage': 'Sa-Su 09:00-14:00',
			'hasMenuItem': [
				{
					'@type': 'MenuItem',
					'name': 'Salmon Chips',
					'description': 'Too good to be true!',
					'offers': {
						'@type': 'Offer',
						'priceCurrency': 'USD',
						'price': '10',
					},
				},
				{
					'@type': 'MenuItem',
					'name': 'Brioche Beignets',
					'description': 'These should be illegal!',
					'offers': {
						'@type': 'Offer',
						'priceCurrency': 'USD',
						'price': '6',
					},
				},
			],
		},
	],
};
