import { writable } from 'svelte/store';

type MediaValues = Record<
	| 'orientation'
	| 'scan'
	| 'width'
	| 'height'
	| 'device-width'
	| 'device-height'
	| 'resolution'
	| 'aspect-ratio'
	| 'device-aspect-ratio'
	| 'grid'
	| 'color'
	| 'color-index'
	| 'monochrome'
	| 'prefers-color-scheme',
	unknown
>;

type Favicon = {
	href: string;
	rel: 'shortcut icon' | 'icon';
};

type AlternativeFavicon = {
	sizes: string;
	type?: 'image/jpg' | 'image/png' | 'image/webp';
} & Favicon;

/**
 * {@link https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html}
 */
type AppleImages = {
	/**
	 * Use 100% black for all vectors with a transparent background in SVG format.
	 *
	 * @property `color` - That attribute can specify a single color with a
	 * hexadecimal value (#990000), an RGB value (rgb(153, 0, 0)), or a
	 * recognized color-keyword, such as: red, lime, or navy
	 *
	 * Important: The SVG file must be a single layer and the viewBox
	 * attribute must be set to "0 0 16 16".
	 *
	 * @see {@link https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/pinnedTabs/pinnedTabs.html#//apple_ref/doc/uid/TP40002051-CH18-SW2}
	 */
	'mask-icon'?: {
		href: string;
		color: string;
	};
	/**
	 * Webpage Icon for Web Clip
	 */
	'apple-touch-icon'?: {
		href: string;
		sizes?: string;
	}[];
	'apple-touch-startup-image'?: {
		href: string;
		media: string;
	}[];
};

type LinkTags = {
	favicon?: Favicon;
	'favicon:alt'?: AlternativeFavicon[];
} & Partial<AppleImages>;

const altFavicon: AlternativeFavicon[] = [
	{
		href: '',
		sizes: '16x16',
		type: 'image/png',
		rel: 'icon',
	},
	{
		href: '',
		sizes: '32x32',
		type: 'image/png',
		rel: 'icon',
	},
	{
		href: '',
		sizes: '96x96',
		type: 'image/png',
		rel: 'icon',
	},
	{
		href: '',
		sizes: '192x192',
		type: 'image/png',
		rel: 'icon',
	},
];

type MicrosoftLinks = {
	'msapplication-starturl': string;
};

type MicroFormat = {
	/**
	 * By adding rel="home" to a hyperlink, a page indicates that the destination of that hyperlink is the homepage of the site in which the current page appears.
	 */
	home: string;
};

const initialTags: LinkTags = {
	favicon: {
		href: '',
		rel: 'shortcut icon',
	},
	'favicon:alt': altFavicon,
};

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
