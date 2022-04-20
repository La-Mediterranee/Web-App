import type { MenuItem as SchemaMenuItem, MenuSection, WithContext } from 'schema-dts';
import type { MenuItem } from 'types/product';

export function menuitem(item: MenuItem, url?: string, currency: string = 'EUR') {
	return <WithContext<SchemaMenuItem>>{
		'@context': 'https://schema.org',
		'@type': 'MenuItem',
		'@id': url,
		'url': url,
		'name': item.name,
		'description': item.desc,
		'image': {
			'@type': 'ImageObject',
			'url': item.image.src,
			'name': item.image.alt || item.name,
			'width': {
				'@type': 'QuantitativeValue',
				'value': item.image.width,
			},
			'height': {
				'@type': 'QuantitativeValue',
				'value': item.image.height,
			},
		},
		'offers': {
			'@type': 'Offer',
			// We are working with cents/lowest currency unit
			'price': (item.sale?.price || item.price) / 100,
			'priceCurrency': currency,
			'availabilityStarts': item.sale?.start.toUTCString(),
			'availabilityEnds': item.sale?.end.toUTCString(),
		},
		'menuAddOn': item.toppings?.map<MenuSection>(topping => ({
			'@type': 'MenuSection',
			'name': topping.name,
			'description': topping.desc,
			'hasMenuItem': topping.options.map<SchemaMenuItem>(option => ({
				'@type': 'MenuItem',
				'name': option.name,
				'description': option.desc,
				'offers': {
					'@type': 'Offer',
					'price': option.price,
					'priceCurrency': 'EUR',
				},
				'image': {
					'@type': 'ImageObject',
					'url': option.image?.src,
					'name': option.image?.alt || option?.name,
					'width': {
						'@type': 'QuantitativeValue',
						'value': option.image?.width,
					},
					'height': {
						'@type': 'QuantitativeValue',
						'value': option.image?.height,
					},
				},
				'suitableForDiet': 'https://schema.org/HalalDiet',
			})),
			'suitableForDiet': 'https://schema.org/HalalDiet',
		})),
	};
}
