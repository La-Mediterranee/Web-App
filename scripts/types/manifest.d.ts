/**
 * @author Abd El Rahaman Shehata <abdo.shehata1504@gmail.com>
 *
 * {@link https://web.dev/add-manifest}
 */

type Mutable<T> = {
	-readonly [K in keyof T]: T[K];
};

/**
 *
 * `"standalone"`: Opens the web app to look and feel like a standalone app.
 * The app runs in its own window, separate from the browser, and hides standard
 * browser UI elements like the URL bar
 *
 * `"fullscreen"`: 	Opens the web application without any browser UI and takes
 * up the entirety of the available display area.
 *
 * `"minimal-ui"`: This mode is similar to standalone, but provides the user a
 * minimal set of UI elements for controlling navigation (such as back and reload).
 */
type DisplayMode = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';

/**
 * @see https://w3.org/TR/image-resource/#dfn-image-resource
 */
interface ImageResource {
	src: string;
	/**
	 * @example "512x512"
	 */
	sizes?: string;
	/**
	 * @example "image/webp"
	 */
	type?: string;
	/**
	 * `"monochrome"` : A user agent can present this icon where a monochrome icon
	 * with a solid fill is needed. The color information in the icon is discarded
	 * and only the alpha data is used. The icon can then be used by the user agent
	 * like a mask over any solid fill.
	 * (FEATURE AT RISK) ISSUE 905: badge purpose "monochrome" is only supported by Firefox
	 *
	 * `"maskable"`: The image is designed with icon masks and safe zone in mind,
	 * such that any part of the image that is outside the safe zone can safely be
	 * ignored and masked away by the user agent.
	 *
	 * The safe zone is the area within a maskable icon which is guaranteed to
	 * always be visible, regardless of user agent preferences.
	 * It is defined as a circle with center point in the center of the icon
	 * and with a radius of 2/5 (40%) of the icon size, which means the smaller
	 * of the icon width and height, in case the icon is not square.
	 *
	 * `"any"` : The user agent is free to display the icon in any context.
	 *
	 * @defaultValue `"any"`
	 */
	purpose?: 'monochrome' | 'maskable' | 'any';
}

type ShortcutItem = {
	/**
	 * Represents the name of the shortcut as it is usually displayed to the user in a context menu
	 */
	name: string;
	/**
	 * Short version of the name of the shortcut.
	 * It is intended to be used where there is insufficient space to display the full name of the shortcut
	 */
	short_name: string;
	/**
	 * Allows the developer to describe the purpose of the shortcut.
	 * User agents MAY expose this information to assistive technology
	 */
	description: string;
	/**
	 * URL within scope of a processed manifest that opens when the associated shortcut is activated
	 */
	url: string;
	/**
	 * Lists images that serve as iconic representations of the shortcut in various contexts
	 */
	icons: string;
};

type ExternalApplicationResourceID = string;

type ExternalApplicationResourceURL = string;

type ExternalApplicationResource = {
	platform: string;
	id?: string;
	url?: string;
	min_version?: string;
	fingerprints?: {
		type: string;
		value: string;
	}[];
};

type ApplicationInfoDescription =
	| 'books'
	| 'business'
	| 'donations'
	| 'education'
	| 'entertainment'
	| 'finance'
	| 'fitness'
	| 'food'
	| 'fundraising'
	| 'games'
	| 'government'
	| 'health'
	| 'kids'
	| 'lifestyle'
	| 'magazines'
	| 'medical'
	| 'music'
	| 'navigation'
	| 'news'
	| 'personalization'
	| 'photo'
	| 'politics'
	| 'productivity'
	| 'security'
	| 'shopping'
	| 'social'
	| 'sports'
	| 'travel'
	| 'utilities'
	| 'weather';

interface Screenshot extends ImageResource {
	/**
	 * Serves as the accessible name of that screenshots object.
	 * For accessibility, authors are encouraged to provide a label for each screenshot.
	 * This member can serve as alternative text for the rendered screenshot.
	 */
	label: string;
	/**
	 * @summary Authors are encouraged to only use this member when
	 * the screenshot is only applicable in a specific context.
	 *
	 * NOTE:
	 * Authors should only use platform for instances where a screenshot is not representative
	 * of a universal experience. For instance, if the layout/design differs based on orientation,
	 * setting "narrow" or "wide" is advisable. Similarly, an OS-specific platform designation
	 * should be reserved for instances where the screenshot includes functionality only available
	 * on that specific platform.
	 *
	 * @description
	 *
	 * `"narrow"`: For narrow screenshots (e.g., wearables, mobile devices).
	 *
	 * `"wide"`: For screenshots applicable to wide screens only (e.g., status boards).
	 *
	 *
	 * List of platform values that are specific to an operating system:
	 *
	 * `"android"`: For Google Android.
	 *
	 * `"chromeos"`: For Google ChromeOS.
	 *
	 * `"ios"`: For Apple iPadOS and For Apple iOS.
	 *
	 * `"kaios"`: For KaiOS.
	 *
	 * `"macos"`: For Apple macOS.
	 *
	 * `"windows"`: For Microsoft Windows.
	 *
	 * `"windows10x"`: For Microsoft Windows 10X.
	 *
	 * `"xbox"`: For Microsoft Xbox.
	 *
	 *
	 * List of platform values aligned with application distribution platforms:
	 *
	 * `"play"`: Google Play Store
	 *
	 * `"itunes"`: iTunes App Store
	 *
	 * `"microsoft-store"`: Microsoft Store
	 *
	 *  `"chrome_web_store"`: Google Chrome Web Store
	 *
	 * `"microsoft-inbox"`: Pre-installed with Microsoft Windows
	 *
	 *
	 * */
	platform?:
		| 'narrow'
		| 'wide'
		| 'android'
		| 'chromeos'
		| 'ios'
		| 'kaios'
		| 'macos'
		| 'windows'
		| 'windows10x'
		| 'xbox'
		| 'play'
		| 'itunes'
		| 'microsoft-store'
		| 'chrome_web_store'
		| 'microsoft-inbox';
}

/**
 * These members are classified as supplementary because
 * they are not applied to a web application at runtime
 * (i.e., they are purely advisory and don't affect how a
 * user agent presents an installed web application)
 *
 * For information about the Spec visit
 * {@link https://www.w3.org/TR/manifest-app-info}
 */
type ApplicationInformation = {
	categories?: readonly ApplicationInfoDescription[] | readonly string[];
	description?: string;
	/**
	 * Represents the International Age Rating Coalition (IARC) certification code of the web application.
	 * It is intended to be used to determine which ages the web application is appropriate for.
	 *
	 * NOTE:
	 * An IARC certificate can be obtained via participating storefronts, intended to be used for
	 * distributing the web app. The iarc_rating_id member only takes a single certification code.
	 * The same code can be shared across participating storefronts, as long as the distributed
	 * product remains the same (i.e., doesn’t serve totally different code paths depending on
	 * user agent sniffing and the like) and the other storefronts support it.
	 *
	 * @example "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7"
	 */
	iarc_rating_id?: string;
	screenshots?: Screenshot[];
};

/**
 * Experimental Features
 */
type ExperientalProperties = {
	/**
	 * The window controls overlay will be visible only when all of the 
	 * following conditions are satisfied:
	 * 
	 * - The app is not opened in the browser, but in a separate PWA window.
	 * - The manifest includes "display_override": ["window-controls-overlay"]  
	 * (Other values are allowed thereafter.).
	 * - The PWA is running on a desktop operating system. 
	 * - The current origin matches the origin for which the PWA was installed.

	 */
	display_override: readonly (DisplayMode | 'window-controls-overlay')[];
};

// type VendorExtensions = Record<string, any>;

type VendorExtensions = {
	gcm_sender_id: '103953800507';
	gcm_user_visible_only: boolean;
	capture_links: 'none';
};

type WebApplicationManifest = {
	name: string;
	short_name: string;
	/**
	 * @defaultValue `"browser"`
	 */
	display: DisplayMode;
	/**
	 * @defaultValue `"auto"`
	 */
	dir: 'rtl' | 'ltr' | 'auto';
	/**
	 * @description
	 * It repeats what is already available in the application stylesheet but can be used
	 * by the user agent to draw the background color of a web application for which the manifest
	 * is known before the files are actually available, whether they are fetched from the network or
	 * retrieved from disk.
	 *
	 * The `background_color` member is only meant to improve the user experience while a web application
	 * is loading and MUST NOT be used by the user agent as the background color when the web application's
	 * stylesheet is available.
	 *
	 * Implementors MAY override the value defined by the `background_color` member to support `prefers-color-scheme`.
	 */
	background_color: string;
	/**
	 * @description
	 * Serves as the default theme color for an application context.
	 * What constitutes a theme color is defined in [HTML].
	 *
	 * If the user agent honors the value of the `theme_color` member as the default theme color,
	 * then that color serves as the theme color for all browsing contexts to which the manifest is applied.
	 * However, a document may override the default theme color through the inclusion of a valid [HTML]
	 * meta element whose name attribute value is `theme-color`.
	 */
	theme_color: string;
	/**
	 * @example
	 * ```txt
	 * If the value of start_url is "../start_point.html", and the
	 * manifest's URL is "https://example.com/resources/manifest.webmanifest",
	 * then the result of parsing would be "https://example.com/start_point.html".
	 * ```
	 */
	start_url: string;
	/**
	 * @description
	 * Represents the navigation scope of this web application's application context.
	 *
	 * @defaultValue
	 * The "default scope" (when scope member is missing, empty, or failure)
	 * is the start URL, but with its filename, query, and fragment removed.
	 */
	scope: string;
	icons: ImageResource[];

	/**
	 * @description
	 * Specifies the primary language for the values of the manifest's
	 * localizable members (as knowing the language can also help with directionality)
	 * A language tag matches the production of a Language-Tag defined in the [BCP47] specifications
	 * (see the IANA Language Subtag Registry for an authoritative list of possible values)
	 *
	 * @example
	 * en-GB
	 */
	lang: string;
	orientation?: OrientationLockType;
	/**
	 *
	 * `platform` and either `id` or `url` or both are mendatory
	 * for this to work.
	 * Can't find a way to make a Type that checks if one or the other
	 * is included and make the other one optional
	 *
	 *  @experimental marked "at risk" as per the W3C Process
	 */
	related_applications?: ExternalApplicationResource[];
	/**
	 * @experimental marked "at risk" as per the W3C Process
	 *
	 * @description
	 * If `prefer_related_applications` is set to true,
	 * and the user agent wants to suggest to install the web application,
	 * the user agent might want to suggest installing one of the related applications instead
	 */
	prefer_related_applications?: boolean;
	shortcuts?: ShortcutItem[];
} & ApplicationInformation &
	Partial<ExperientalProperties> &
	Partial<VendorExtensions>;
