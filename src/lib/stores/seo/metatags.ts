import { writable } from 'svelte/store';

// import type { Metatags, MicrosoftPWA } from './metatag';

const title = 'La-Mediterranee Shop';
const description =
	'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!';
const img =
	'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png';
const type = 'website';

const openGraph: OpenGraph = {
	'og:url': 'https://sveltesociety.dev/',
	'og:site_name': 'La-Mediterranee',
	'og:locale': '',
	'og:title': title,
	'og:description': description,
	'og:type': type,
	'og:image': img,
	'og:image:alt': 'SvelteSociety.dev',
};

// - restaurant.menu:  This object type represents a restaurant's menu. A restaurant can have multiple menus, and each menu has multiple sections.

// - restaurant.menu_item: This object type represents a single item on a restaurant's menu. Every item belongs within a menu section.

// - restaurant.menu_section: This object type represents a section in a restaurant's menu. A section contains multiple menu items.

// - restaurant.restaurant: This object type represents a restaurant at a specific location.

// - restaurant.visited: An action representing someone visiting a restaurant.

// - restaurant.wants_to_visit: An action representing someone wanting to visit a restaurant

const twitter: Twitter = {
	'twitter:card': 'summary',
	'twitter:title': title,
	// 'twitter:description': description,
	// 'twitter:image': img,
	// 'twitter:image:alt': 'SvelteSociety.dev',
};

const initialTags: Metatags = {
	title: title,
	description: '',
	type: type,
	image: img,
	alt: 'SvelteSociety.dev',
	openGraph,
	twitter,
};

export type MetaTagsStore = ReturnType<typeof createMetatagsStore>;

function createMetatagsStore() {
	const { subscribe, set, update } = writable(initialTags);

	const reset = () => set(initialTags);

	return {
		set newUrl(newUrl: string) {
			update(curr => ({ ...curr, 'og:url': newUrl }));
		},
		set newTitle(newTitle: string) {
			update(curr => ({
				...curr,
				'title': newTitle,
				'og:title': newTitle,
				'twitter:title': newTitle,
			}));
		},
		set newDesc(newDesc: string) {
			update(curr => ({
				...curr,
				'description': newDesc,
				'og:description': newDesc,
				'twitter:description': newDesc,
			}));
		},
		set newImage(newImage: string) {
			update(curr => ({
				...curr,
				'image': newImage,
				'og:image': newImage,
				'twitter:image': newImage,
			}));
		},
		set newAlt(newAlt: string) {
			update(curr => ({
				...curr,
				'alt': newAlt,
				'og:image:alt': newAlt,
				'twitter:image:alt': newAlt,
			}));
		},
		reset,
		subscribe,
		set,
	} as const;

	// const title = (title: string) =>
	// 	update((curr) => ({
	// 		...curr,
	// 		title: title,
	// 		'og:title': title,
	// 		'twitter:title': title,
	// 	}));

	// const desc = (desc: string) =>
	// 	update((curr) => ({
	// 		...curr,
	// 		description: desc,
	// 		'og:description': desc,
	// 		'twitter:description': desc,
	// 	}));

	// const image = (image: string) =>
	// 	update((curr) => ({
	// 		...curr,
	// 		image: image,
	// 		'og:image': image,
	// 		'twitter:image': image,
	// 	}));

	// const alt = (alt: string) =>
	// 	update((curr) => ({
	// 		...curr,
	// 		alt: alt,
	// 		'og:image:alt': alt,
	// 		'twitter:image:alt': alt,
	// 	}));

	// const url = (url: string) => update((curr) => ({ ...curr, 'og:url': url }));

	// return {
	// title,
	// 	desc,
	// 	image,
	// 	alt,
	// 	url,
	// 	reset,
	// 	subscribe,
	// 	set,
	// } as const;
}

export const metatags = createMetatagsStore();

export default metatags;

// const microsoft: MicrosoftPWA = {
// 	'msapplication-config': '',
// 	'msapplication-TileColor': '',
// 	'msapplication-TileImage': '',
// 	'msapplication-tap-highlight': 'yes',
// };
