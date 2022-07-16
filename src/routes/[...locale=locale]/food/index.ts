import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit/types';

const categories: Record<Locales, string[]> = {
	de: [
		'Pizza',
		'Suppen',
		'Salat',
		'Risotto',
		'Pasta',
		'Fleischgerichte',
		'Fischgerichte',
		'Burger',
		'Mexikanische Spezialitäten',
		'Crespelle',
		'Nachspeisen',
		'Vorspeisen',
	],
	en: [
		'Pizza',
		'Soups',
		'Salad',
		'Risotto',
		'Pasta',
		'Meat Dishes',
		'Fish Dishes',
		'Burger',
		'Mexican Specialties',
		'Crepes',
		'Dessert',
		'Appetizers',
	],
	ar: [
		'Pizza',
		'Soups',
		'Salad',
		'Risotto',
		'Pasta',
		'Meat Dishes',
		'Fish Dishes',
		'Burger',
		'Mexican Specialties',
		'Crepes',
		'Dessert',
		'Appetizers',
	],
};

export async function get(event: RequestEvent): Promise<RequestHandlerOutput> {
	return {
		body: {
			categories: categories[event.locals.locale],
		},
	};
}
