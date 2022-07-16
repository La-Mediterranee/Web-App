import { SERVER_URL } from '$lib/server/constants';

import type { MenuItem } from 'types/product';
import type { BreadcrumbList, WithContext } from 'schema-dts';
import type { RequestEvent, RequestHandlerOutput, ResponseBody } from '@sveltejs/kit/types';

export async function GET(event: RequestEvent): Promise<RequestHandlerOutput> {
	const res = await fetch(`${SERVER_URL}/v1/products/drinks`);
	if (!res.ok) return { status: 500 };

	const drinks: MenuItem[] = await res.json();

	const LL = event.locals.LL;

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
		body: {
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
		} as unknown as ResponseBody,
	};
}
