import { browser } from '$app/env';
import { getContext, setContext } from 'svelte';
import { readable } from 'svelte/store';

type Allergens = Record<string, string>;
function createAllergensStore() {
	let allergens: Record<string, string>;

	if (browser) {
		fetch('/api/allergens')
			.then(async res => {
				try {
					allergens = await res.json();
				} catch (error) {
					console.error(error);
				}
			})
			.catch(e => {
				console.error(e);
			});
	}

	return readable<Allergens>({}, set => {
		set(allergens);
	});
}

export type AllergensStore = ReturnType<typeof createAllergensStore>;

const STORE_KEY = Symbol('Allergens');

export function setAllergensContext() {
	const allergens = createAllergensStore();
	setContext(STORE_KEY, allergens);
	return allergens;
}

export function getAllergensContext(): AllergensStore {
	return getContext(STORE_KEY);
}

export const allergens: SvelteStore<Allergens> = {
	subscribe(fn) {
		const app = getAllergensContext();
		return app.subscribe(fn);
	},
};
