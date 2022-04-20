import type { RequestEvent } from '@sveltejs/kit/types/private';

export function get(event: RequestEvent) {
	// fetch('', {
	// 	cf: {
	// 		// Always cache this fetch regardless of content type
	// 		// for a max of 30 days before revalidating the resource
	// 		cacheTtl: 30 * 24 * 60 * 60,
	// 		cacheEverything: true,
	// 	},
	// });
	return {
		body: JSON.stringify(allergens[event.locals.locale]),
	};
}

const allergens = {
	en: {
		A: 'Gluten-containing grains',
		B: 'Crustaceans',
		C: 'Egg',
		D: 'Fish',
		E: 'Peanut',
		F: 'Soy',
		G: 'Milk or lactose',
		H: 'Edible nuts',
		L: 'Celery',
		M: 'Mustard',
		N: 'Sesame',
		O: 'Sulphites',
		P: 'Lupines',
		R: 'Molluscs',
	},
	de: {
		A: 'glutenhaltiges Getreide',
		B: 'Krebstiere',
		C: 'Ei',
		D: 'Fisch',
		E: 'Erdnuss',
		F: 'Soja',
		G: 'Milch or Laktose',
		H: 'Schalenfrüchte',
		L: 'Sellerie',
		M: 'Senf',
		N: 'Sesamsamen',
		O: 'Schwefeldioxid',
		P: 'Lupinen',
		R: 'Weichtiere',
	},
	ar: {
		A: 'الحبوب التي تحتوي على الغلوتين',
		B: 'القشريات',
		C: 'البيض',
		D: 'السمك',
		E: 'الفول السوداني',
		F: 'الصويا',
		G: 'الحليب أو اللاكتوز',
		H: 'المكسرات',
		L: 'كرفس',
		M: 'خردل',
		N: 'بذور السمسم',
		O: 'ثاني أكسيد الكبريت',
		P: 'الترمس',
		R: 'الرخويات',
	},
};
