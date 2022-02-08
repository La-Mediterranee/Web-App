/// <reference types="../../../../scripts/types" />

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

// declare const Favicon = <T extends 'shortcut' | 'icon'>() => {
// 	return {
// 		href: string,
// 		rel: T === 'shortcut' ? 'shortcut icon' : 'icon',
// 		sizes: string,
// 	};
// };

type Favicon<T extends 'shortcut' | 'icon'> = {
	href: string;
	rel: T extends 'shortcut' ? 'shortcut icon' : 'icon';
	sizes: string;
};

type AlternativeFavicon = {
	type?: 'image/jpg' | 'image/png' | 'image/webp';
} & Favicon<'icon'>;

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
	'apple-touch-startup-image'?: AppleStartupImage[];
};

type AppleStartupImage = {
	href: string;
	media: string;
};

type LinkTags = {
	'favicon'?: Favicon<'shortcut'>;
	'favicon:alt'?: AlternativeFavicon[];
} & Partial<AppleImages> &
	Partial<MicrosoftLinks> &
	Partial<MicroFormat>;

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

type IpadScreeenResolutions = {
	'1536x2048': 2;
	'1668x2224': 2;
	'1620x2160': 2;
	'1668x2388': 2;
	'2048x2732': 2;
};

type IphoneScreeenResolutions = {
	'750x1334': 2;
	'828x1792': 2;
	'1080x1920': 3;
	'1125x2436': 3;
	'1170x2532': 3;
	'1284x2778': 3;
};

const ipadResolutions: IpadScreeenResolutions = {
	'1536x2048': 2,
	'1620x2160': 2,
	'1668x2224': 2,
	'1668x2388': 2,
	'2048x2732': 2,
};

const iphoneResolutions: IphoneScreeenResolutions = {
	'750x1334': 2,
	'828x1792': 2,
	'1080x1920': 3,
	'1125x2436': 3,
	'1170x2532': 3,
	'1284x2778': 3,
};

const combined = Object.assign({}, iphoneResolutions, ipadResolutions);

const initialTags: LinkTags = {
	'favicon': {
		href: '',
		rel: 'shortcut icon',
		sizes: '192x192',
	},
	'favicon:alt': altFavicon,
	'apple-touch-startup-image': ([] as AppleStartupImage[]).concat(
		...Object.entries(combined).map(([size, density]) => {
			const split = size.split('x');
			const width = Number(split[0]);
			const height = Number(split[1]);

			const portrait = createPortraitMetaTag(width, height, density);
			const landscape = createLandscapeMetaTag(width, height, density);

			return [
				{
					href: `/static/apple/splash/splash-portrait-${size}.png`,
					media: portrait,
				},
				{
					href: `/static/apple/splash/splash-landscape-${split[1]}x${split[0]}.png`,
					media: landscape,
				},
			];
		}),
	),
};

function createLandscapeMetaTag(width: number, height: number, density: number) {
	return `screen and (device-width: ${width / density}px) and (device-height: ${
		height / density
	}px) and (-webkit-device-pixel-ratio: ${density}) and (orientation: landscape)`;
}

function createPortraitMetaTag(width: number, height: number, density: number) {
	return `screen and (device-width: ${width / density}px) and (device-height: ${
		height / density
	}px) and (-webkit-device-pixel-ratio: ${density}) and (orientation: portrait)`;
}

export type LinkTagsStore = ReturnType<typeof createLinkTagsStore>;

function createLinkTagsStore() {
	const { subscribe, set, update } = writable(initialTags);

	const canonical = (title: string) =>
		update(curr => ({
			...curr,
			'title': title,
			'og:title': title,
			'twitter:title': title,
		}));

	const desc = (desc: string) =>
		update(curr => ({
			...curr,
			'description': desc,
			'og:description': desc,
			'twitter:description': desc,
		}));

	const image = (image: string) =>
		update(curr => ({
			...curr,
			'image': image,
			'og:image': image,
			'twitter:image': image,
		}));

	const alt = (alt: string) =>
		update(curr => ({
			...curr,
			'alt': alt,
			'og:image:alt': alt,
			'twitter:image:alt': alt,
		}));

	const url = (url: string) => update(curr => ({ ...curr, 'og:url': url }));

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
