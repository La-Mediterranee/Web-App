import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

import type { AppState } from 'types/index';

export function appStore() {
	const store = writable<AppState>({
		displayCurrency: '€',
		activeRoute: undefined,
		currency: 'EUR',
		store: {
			priceRange: '€',
			address: {
				city: 'Vienna',
				country: 'AT',
				street: 'Deublergasse 17',
				postalCode: 1210,
				latitude: 3223,
				longitude: 5468468,
			},
		},
	});

	const { update, set, subscribe } = store;

	function setActiveRoute(route?: string) {
		update(app => {
			app.activeRoute = route;
			return app;
		});
	}

	return {
		subscribe,
		setActiveRoute,
	};
}

export type AppStore = ReturnType<typeof appStore>;

const STORE_KEY = Symbol('App');

export function setAppContext() {
	const app = appStore();
	setContext(STORE_KEY, app);
	return app;
}

export function getAppContext(): AppStore {
	return getContext(STORE_KEY);
}
