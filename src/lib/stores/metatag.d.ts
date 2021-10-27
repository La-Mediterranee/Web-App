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

// in most usecases WebAppTags,MicrosoftPWA and ApplePWA are static and
// this is why I will remove/comment them out here and
// add them to the scripts

type WebAppTags = {
	'application-name'?: string;
};

interface MicrosoftPWAImages {
	'msapplication-square70x70logo': string;
	'msapplication-square150x150logo': string;
	'msapplication-square310x310logo': string;
	'msapplication-wide310x150logo': string;
}

/**
 * These files/tags are good to have if you want to support IE11 and non-Chromium Egde
 * you should either use the `msapplication-TileImage`, `msapplication-TileColor` and `MicrosoftPWAImages` or `msapplication-config`
 * because both include the same information
 */
type MicrosoftPWA = {
	'msapplication-TileImage': string;
	'msapplication-TileColor': string;
	/**
	 * url to the file
	 */
	'msapplication-config': string;
	/**
	 * For IE11
	 */
	'msapplication-tap-highlight'?: 'yes' | 'no';
} & MicrosoftPWAImages;

type ApplePWA = {
	'apple-mobile-web-app-title': string;
	/**
	 * default: white background with black text and icons
	 * black: The default black bar with black text and icons (not recommended)
	 * black-translucent: white text and icons with a transparent background.
	 */
	'apple-mobile-web-app-status-bar-style': 'default' | 'black' | 'black-translucent';
	'apple-touch-fullscreen'?: 'yes' | 'no';
	'apple-mobile-web-app-capable'?: 'yes' | 'no';
	'mobile-web-app-capable'?: 'yes' | 'no';
};

type PWAImages = {
	'msapplication-TileImage'?: string;
};

type Metatags = {
	title: string;
	description: string;
	type: string;
	image: string;
	alt: string;
	robots?: string;
	generator?: string; //static
	openGraph: OpenGraph;
	twitter: Partial<Twitter>;
	microsoft: Partial<MicrosoftPWA>; //static
} & Partial<PWAImages> & //static
	Partial<ApplePWA> & //static
	Partial<WebAppTags>; //static
// & OpenGraph &
// 	Partial<MicrosoftPWA> &
// 	Partial<Twitter>
