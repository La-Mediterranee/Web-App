import { writable } from 'svelte/store';

function appStore() {
	const store = writable({
		activeRoute: '/',
	});

	const { update, set, subscribe } = store;

	function setActiveRoute(route: string) {
		update(app => {
			app.activeRoute = route;
			return app;
		});
	}

	return {
		setActiveRoute,
		subscribe,
	};
}
