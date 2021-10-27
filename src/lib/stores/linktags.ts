/// <reference types="../../../scripts/types/types" />

import { writable } from 'svelte/store';

const initialTags: LinkTags = {};

export type LinkTagsStore = ReturnType<typeof createLinkTagsStore>;

function createLinkTagsStore() {
	const { subscribe, set, update } = writable(initialTags);

	const canonical = (title: string) =>
		update((curr) => ({
			...curr,
			title: title,
			'og:title': title,
			'twitter:title': title,
		}));

	const desc = (desc: string) =>
		update((curr) => ({
			...curr,
			description: desc,
			'og:description': desc,
			'twitter:description': desc,
		}));

	const image = (image: string) =>
		update((curr) => ({
			...curr,
			image: image,
			'og:image': image,
			'twitter:image': image,
		}));

	const alt = (alt: string) =>
		update((curr) => ({
			...curr,
			alt: alt,
			'og:image:alt': alt,
			'twitter:image:alt': alt,
		}));

	const url = (url: string) => update((curr) => ({ ...curr, 'og:url': url }));

	const reset = () => set(initialTags);

	return {
		subscribe,
		set,
		url,
		canonical,
		desc,
		image,
		alt,
		reset,
	} as const;
}

export const store = createLinkTagsStore();

export default store;
