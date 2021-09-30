import { writable } from 'svelte/store';

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
	'twtter:creator'?: string;
	'twitter:site'?: string;
};

type Color = string;

type AppleImages = {};

type ApplePWA = {
	'apple-mobile-web-app-title': string;
	'apple-mobile-web-app-status-bar-style': Color;
	'apple-touch-fullscreen'?: 'yes' | 'no';
	'apple-mobile-web-app-capable?': 'yes' | 'no';
};

type PWAImages = {
	'msapplication-TileImage'?: string;
};

type Metatags = OpenGraph &
	Partial<Twitter> &
	Partial<PWAImages> &
	Partial<ApplePWA> & {
		title: string;
		description: string;
		type: string;
		image: string;
		alt: string;
		robots?: string;
		generator?: string;
	};

const title = 'La-Mediterranee Shop';

const initialTags: Metatags = {
	title: title,
	description: '',
	type: 'website',
	image: 'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	alt: 'SvelteSociety.dev',
	'apple-mobile-web-app-title': title,

	// Open Graph
	'og:url': 'https://sveltesociety.dev/',
	'og:site_name': 'La-Mediterranee',
	'og:locale': '',
	'og:title': title,
	'og:description':
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
	'og:type': 'website',
	'og:image':
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	'og:image:alt': 'SvelteSociety.dev',

	// Twitter
	'twitter:card': 'summary_large_image',
	'twitter:title': title,
	'twitter:description':
		'We are a volunteer global network of Svelte fans that strive to promote Svelte and its ecosystem. As a service to the community, this site is a central index of events, a components directory, as well as recipes and other useful resources. Join us or help us out!',
	'twitter:image':
		'https://raw.githubusercontent.com/svelte-society/sveltesociety.dev/main/src/routes/metatag.png',
	'twitter:image:alt': 'SvelteSociety.dev',
};

export type MetaTagsStore = ReturnType<typeof createMetatagsStore>;

function createMetatagsStore() {
	const { subscribe, set, update } = writable(initialTags);

	const reset = () => set(initialTags);

	return {
		set newTitle(newTitle: string) {
			update((curr) => ({
				...curr,
				title: newTitle,
				'og:title': newTitle,
				'twitter:title': newTitle,
				'apple-mobile-web-app-title': newTitle,
			}));
		},
		set newDesc(newDesc: string) {
			update((curr) => ({
				...curr,
				description: newDesc,
				'og:description': newDesc,
				'twitter:description': newDesc,
			}));
		},
		set newImage(newImage: string) {
			update((curr) => ({
				...curr,
				image: newImage,
				'og:image': newImage,
				'twitter:image': newImage,
			}));
		},
		set newAlt(newAlt: string) {
			update((curr) => ({
				...curr,
				alt: newAlt,
				'og:image:alt': newAlt,
				'twitter:image:alt': newAlt,
			}));
		},
		set newUrl(newUrl: string) {
			update((curr) => ({ ...curr, 'og:url': newUrl }));
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
	// 		'apple-mobile-web-app-title': title,
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

const e = {
	'@context': 'http://schema.org',
	'@type': 'Organization',
	name: 'MediaMarkt',
	url: 'https://www.mediamarkt.at/',
	logo: 'https://assets.mmsrg.com/is/166325/12975367df8e182e57044734f5165e190/c3/-/abf3d0567b8824b57828926082859f66d?version=0&x=300&y=40&format=jpg',
	foundingDate: '1979-11-24',
	address: {
		'@type': 'PostalAddress',
		streetAddress: 'SCS-Bürocenter B2',
		addressLocality: 'Vösendorf',
		postalCode: '2334',
		addressCountry: 'Österreich',
	},
	contactPoint: {
		'@type': 'ContactPoint',
		contactType: 'Kontakt',
		email: 'kundenservice@mediamarkt.at',
	},
	potentialAction: {
		'@type': 'SearchAction',
		target: 'https://www.mediamarkt.at/de/search.html?query={search_term_string}',
		'query-input': 'required name=search_term_string',
	},
};
