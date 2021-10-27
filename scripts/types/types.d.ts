// Utility Types
type MaybeUndefined<T> = T | undefined;
type MaybePromise<T> = T | Promise<T>;
type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

/**
 * HEX codes, rbg(), hsl()
 */
type Color = string;

type DirPath = string;
type FilePath = string;

type ManifestOptions = Readonly<
	{
		name: string;
		icons: ImageResource[];
		shortName?: string;
		themeColor?: string;
		backgroundColor?: string;
		startUrl?: string;
	} & Partial<Omit<WebApplicationManifest, 'short_name' | 'theme_color' | 'background_color' | 'start_url'>>
>;

type ManifestConfig = {
	icon: import('sharp').Sharp;
	padding: number;
	iconsOutDir?: string;
	manifestOutPath?: string;
	manifest: Partial<ManifestOptions>;
};

interface ApplePWA {
	/**
	 * @defaultValue `'yes'`
	 */
	fullscreen?: 'yes' | 'no';
	/**
	 * default: white background with black text and icons
	 * black: The default black bar with black text and icons (not recommended)
	 * black-translucent: white text and icons with a transparent background.
	 *
	 *  @defaultValue `'default'`
	 */
	statusBarStyle: 'default' | 'black' | 'black-translucent';
}

type MediaValues<T> = Record<
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
	T
>;

type MicrosoftLinks = {
	'msapplication-starturl': string;
};

type MicroFormat = {
	/**
	 * By adding rel="home" to a hyperlink, a page indicates that the destination of that hyperlink is the homepage of the site in which the current page appears.
	 */
	home: string;
};

interface Favicon<T extends 'shortcut' | 'icon'> {
	readonly href: string;
	readonly rel: T extends 'shortcut' ? 'shortcut icon' : 'icon';
	readonly sizes: string;
	/**
	 * @defaultValue `'ico'`
	 */
	readonly type?: 'image/jpg' | 'image/png' | 'image/webp';
}

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
