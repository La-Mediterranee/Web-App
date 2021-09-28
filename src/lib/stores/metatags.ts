import { writable } from 'svelte/store';

import type { Writable } from 'svelte/store';

type OpenGraph = {
	'og:title': string;
	'og:type': string;
	'og:url': string;

	'og:description'?: string;
	'og:site_name'?: string;

	'og:locale'?: string;
	'og:locale:alternate'?: string;

	'og:image': string;
	/** A description of what is in the image (not a caption). If the page specifies an og:image it should specify og:image:alt*/
	'og:image:alt'?: string;
	/** A MIME type for this image. */
	'og:image:type'?: string;
	/**The number of pixels wide. */
	'og:image:width'?: string;
	/**The number of pixels high. */
	'og:image:height'?: string;
};

type Twitter = {
	'twitter:title': string;
	'twitter:description': string;
	'twitter:card': string;
	'twitter:image': string;
	'twitter:image:alt': string;
};

type Metatags = Twitter &
	OpenGraph & {
		title: string;
		description: string;
		type: string;
		image: string;
		alt: string;
	};

const initialTags: Metatags = {
	title: 'La-Mediterranee Shop',
	description: '',
	type: 'website',
	image: 'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	alt: 'SvelteSociety.dev',

	// Twitter
	'twitter:card': 'summary_large_image',
	'twitter:title': 'Svelte Society',
	'twitter:description':
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
	'twitter:image':
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	'twitter:image:alt': 'SvelteSociety.dev',

	// Open Graph
	'og:url': 'https://sveltesociety.dev/',
	'og:locale': '',
	'og:title': 'Svelte Society',
	'og:description':
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
	'og:type': 'website',
	'og:image':
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	'og:image:alt': 'SvelteSociety.dev',
};

// type MetaTagsStore = {
// 	subscribe: Writable<Metatags>['subscribe'];
// 	set: Writable<Metatags>['set'];
// 	title: (title: string) => void;
// 	desc: (desc: string) => void;
// 	image: (image: string) => void;
// 	alt: (alt: string) => void;
// 	url: (url: string) => void;
// 	reset: () => void;
// };

export type MetaTagsStore = ReturnType<typeof createMetatagsStore>;

function createMetatagsStore() {
	const { subscribe, set, update } = writable(initialTags);

	const title = (title: string) =>
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
		title,
		desc,
		image,
		alt,
		reset,
	} as const;
}

export const metatags = createMetatagsStore();

export default metatags;
