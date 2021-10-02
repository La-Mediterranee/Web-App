export type OpenGraph = {
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

export type Twitter = {
	'twitter:title': string;
	'twitter:description': string;
	'twitter:card': string;
	'twitter:image': string;
	'twitter:image:alt': string;
	'twtter:creator'?: string;
	'twitter:site'?: string;
};

export type Color = string;

export type MicrosoftPWA = {
	'msapplication-TileImage': string;
	'msapplication-TileColor': string;
	'msapplication-config': string;
	'msapplication-tap-highlight'?: 'yes' | 'no';
};

export type ApplePWA = {
	'application-name': string;
	'apple-mobile-web-app-title': string;
	/**
	 * default: white background with black text and icons
	 * black: The default black bar with black text and icons (not recommended)
	 * black-translucent: white text and icons with a transparent background.
	 */
	'apple-mobile-web-app-status-bar-style':
		| 'default'
		| 'black'
		| 'black-translucent';
	'mobile-web-app-capable'?: 'yes' | 'no';
	'apple-touch-fullscreen'?: 'yes' | 'no';
	'apple-mobile-web-app-capable?': 'yes' | 'no';
};

export type PWAImages = {
	'msapplication-TileImage'?: string;
};

export type Metatags = {
	title: string;
	description: string;
	type: string;
	image: string;
	alt: string;
	robots?: string;
	generator?: string;
	openGraph: OpenGraph;
	twitter: Partial<Twitter>;
	microsoft: Partial<MicrosoftPWA>;
} & Partial<PWAImages> &
	Partial<ApplePWA>;
// & OpenGraph &
// 	Partial<MicrosoftPWA> &
// 	Partial<Twitter>
