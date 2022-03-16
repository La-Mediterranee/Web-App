import { writable } from 'svelte/store';

import type { AppState } from 'types/index';

export function appStore() {
	const store = writable<AppState>({
		currency: '€',
		activeRoute: undefined,
		store: {
			priceRange: '€',
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
