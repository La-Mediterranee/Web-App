import type { RequestEvent, JSONObject, ShadowEndpointOutput } from '@sveltejs/kit/types/internal';

import type { MenuItem } from 'types/product';
import { SERVER_URL } from '$lib/server/constants';
import type { BreadcrumbList, WithContext } from 'schema-dts';
import { i18nObject } from '$i18n/i18n-util';

//mineralwasser mit/ohne 1.5L 280
//eistee pfirsich/zitrone 1.5L 330
//aluvera 0.5L/0.3L

export async function get(event: RequestEvent): Promise<ShadowEndpointOutput> {
	const res = await fetch(`${SERVER_URL}/v1/products/drinks`);
	if (!res.ok) return {};

	const drinks: MenuItem[] = await res.json();

	const LL = i18nObject(event.locals.locale);

	const urlLocale = event.locals.urlLocale;
	const breadcrumb: WithContext<BreadcrumbList> = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'itemListElement': [
			{
				'@type': 'ListItem',
				'position': 1,
				'item': {
					'@id': `https://example.com${urlLocale}`,
					'name': LL.nav.routes.homepage(),
				},
			},
			{
				'@type': 'ListItem',
				'position': 2,
				'item': {
					'@id': `${event.url.toString()}`,
					'name': LL.nav.routes.food(),
				},
			},
		],
	};

	return {
		body: <JSONObject>(<unknown>{
			schema: breadcrumb,
			drinks: drinks.map(drink => {
				const aspectRatio = (drink.image.height || 1) / (drink.image.width || 1);
				return <MenuItem>Object.assign(drink, {
					type: 'drink',
					isAvailable: true,
					isVegetarian: false,
					category: 'drinks',
					toppings: [],
					categoryType: 'menuitem',
					image: {
						...drink.image,
						width: parseInt(250 * aspectRatio + ''),
						height: parseInt(600 * aspectRatio + ''),
						// width: 2,
						// height: 4,
					},
				});
			}),
		}),
	};
}
