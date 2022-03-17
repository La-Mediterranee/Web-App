import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

import type { AppState } from 'types/index';

export function appStore() {
	const store = writable<AppState>({
		currency: '€',
		activeRoute: undefined,
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

export type App = ReturnType<typeof appStore>;

const STORE_KEY = Symbol('App');

export function setAppContext(app: App) {
	return setContext(STORE_KEY, app);
}

export function getAppContext(): App {
	return getContext(STORE_KEY);
}
