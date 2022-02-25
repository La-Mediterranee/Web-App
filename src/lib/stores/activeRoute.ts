import { writable } from 'svelte/store';

export const activeRoute = (() => {
	const { subscribe, set } = writable<string | undefined>('/');

	return {
		subscribe,
		setRoute: (route: string) => {
			// console.debug('setting route:', route);
			set(route);
		},
	};
})();
