type TwitterSummaryCard = {
	'twitter:card': 'summary';
	/**
	 * A concise title for the related content
	 *
	 * Platform specific behaviors:
	 * - iOS, Android: Truncated to two lines in timeline and expanded Tweet
	 * - Web: Truncated to one line in timeline and expanded Tweet
	 */
	'twitter:title': string;

	/**
	 * The Twitter `@username` the card should be attributed to.
	 */
	'twitter:site'?: string;

	/**
	 * Same as twitter:site, but the user’s Twitter ID.
	 */
	'twitter:site:id'?: string;

	/**
	 * A description that concisely summarizes the content as appropriate
	 * for presentation within a Tweet.
	 * You should not re-use the title as the description or use this field
	 * to describe the general services provided by the website.
	 *
	 * Platform specific behaviors:
	 * - iOS, Android: Not displayed
	 * - Web: Truncated to three lines in timeline and expanded Tweet
	 */
	'twitter:description?': string;
	/**
	 * A URL to a unique image representing the content of the page.
	 * You should not use a generic image such as your website logo,
	 * author photo, or other image that spans multiple pages.
	 * Images for this Card support an aspect ratio of 1:1 with minimum dimensions
	 * of 144x144 or maximum of 4096x4096 pixels.
	 * Images must be less than 5MB in size.
	 * The image will be cropped to a square on all platforms.
	 * JPG, PNG, WEBP and GIF formats are supported.
	 * Only the first frame of an animated GIF will be used.
	 *
	 * SVG is not supported.
	 */
	'twitter:image'?: string;

	/**
	 * A text description of the image conveying the essential nature of an image
	 * to users who are visually impaired. Maximum 420 characters.
	 */
	'twitter:image:alt'?: string;

	/**
	 * Twitter user ID of content creator
	 */
	'twtter:creator:id'?: string;
};

type TwitterSummaryLargeImage = {
	'twitter:card': 'summary_large_image';
	/**
	 * A concise title for the related content
	 *
	 * Platform specific behaviors:
	 * - iOS, Android: Truncated to two lines in timeline and expanded Tweet
	 * - Web: Truncated to one line in timeline and expanded Tweet
	 */
	'twitter:title': string;

	/**
	 * The Twitter `@username` the card should be attributed to.
	 */
	'twitter:site'?: string;

	/**
	 * Same as twitter:site, but the user’s Twitter ID.
	 */
	'twitter:site:id'?: string;

	/**
	 * A description that concisely summarizes the content as appropriate
	 * for presentation within a Tweet.
	 * You should not re-use the title as the description or use this field
	 * to describe the general services provided by the website.
	 *
	 * Platform specific behaviors:
	 * - iOS, Android: Not displayed
	 * - Web: Truncated to three lines in timeline and expanded Tweet
	 */
	'twitter:description?': string;
	/**
	 * A URL to a unique image representing the content of the page.
	 * You should not use a generic image such as your website logo, author photo,
	 * or other image that spans multiple pages.
	 * Images for this Card support an aspect ratio of 2:1 with minimum dimensions
	 * of 300x157 or maximum of 4096x4096 pixels.
	 * Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported.
	 * Only the first frame of an animated GIF will be used.
	 *
	 * SVG is not supported.
	 */
	'twitter:image'?: string;

	/**
	 * A text description of the image conveying the essential nature of an image
	 * to users who are visually impaired. Maximum 420 characters.
	 */
	'twitter:image:alt'?: string;

	/**
	 * `@username` for the content creator / author.
	 */
	'twtter:creator'?: string;

	/**
	 * Twitter user ID of content creator
	 */
	'twtter:creator:id'?: string;
};

type TwitterPlayerCard = {
	'twitter:card': 'player';
	/**
	 * The title of your content as it should appear in the card
	 * (max 70 characters)
	 */
	'twitter:title': string;

	/**
	 * A description of the content in a maximum of 200 characters
	 */
	'twitter:description'?: string;

	/**
	 * The Twitter @username the card should be attributed to.
	 */
	'twitter:site': string;

	/**
	 * HTTPS URL to iFrame player.
	 * This must be a HTTPS URL which does not generate active mixed content warnings
	 * in a web browser.
	 * The audio or video player must not require plugins such as Adobe Flash.
	 */
	'twitter:player': string;

	/**
	 * Width of iFrame specified in twitter:player in pixels
	 */
	'twitter:player:width': number;

	/**
	 * Height of iFrame specified in twitter:player in pixels
	 */
	'twitter:player:height': number;

	/**
	 * Image to be displayed in place of the player on platforms that don’t support
	 * iFrames or inline players.
	 * You should make this image the same dimensions as your player.
	 * Images with fewer than 68,600 pixels (a 262x262 square image, or a 350x196 16:9 image)
	 * will cause the player card not to render.
	 * Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported.
	 * Only the first frame of an animated GIF will be used.
	 *
	 * SVG is not supported.
	 */
	'twitter:image': string;

	/**
	 * A text description of the image conveying the essential nature of an image
	 * to users who are visually impaired. Maximum 420 characters.
	 */
	'twitter:image:alt'?: string;

	/**
	 * URL to raw video or audio stream
	 *
	 * Used with player card
	 */
	'twitter:player:stream'?: string;
};

/**
 * Because the type would become really complex I made the
 * Ids optionally because we don't know which platforms the
 * types user supports.
 *
 * @required twitter:site or twitter:site:id and the Ids of your apps
 */
type TwitterAppCard = {
	'twitter:card': 'app';
	/**
	 * The Twitter `@username` the card should be attributed to.
	 *
	 * `@username` of website. Either twitter:site or twitter:site:id is required.
	 */
	'twitter:site'?: string;

	/**
	 * Same as twitter:site, but the user’s Twitter ID. Either twitter:site or
	 * twitter:site:id is required.
	 */
	'twitter:site:id'?: string;

	/**
	 * You can use this as a more concise description than what
	 * you may have on the app store.
	 * This field has a maximum of 200 characters
	 */
	'twitter:description'?: string;

	/**
	 * Your app ID in the iTunes App Store (Note: NOT your bundle ID)
	 *
	 * Used with app card
	 */
	'twitter:app:id:iphone'?: string;

	/**
	 * Name of your iPhone app
	 *
	 * Used with app card
	 *
	 * @required if you have an iphone app
	 */
	'twitter:app:name:iphone'?: string;

	/**
	 * Your app ID in the iTunes App Store
	 *
	 * Used with app card
	 *
	 * @required if you have an ipad app
	 */
	'twitter:app:id:ipad'?: string;

	/**
	 * Your app ID in the Google Play Store
	 *
	 * Used with app card
	 *
	 * @required if you have an android app
	 */
	'twitter:app:id:googleplay'?: string;

	/**
	 * Your app’s custom URL scheme (you must include ”://” after your scheme name)
	 *
	 * Used with app card
	 */
	'twitter:app:url:iphone'?: string;

	/**
	 * Name of your iPad optimized app
	 *
	 * Used with app card
	 */
	'twitter:app:name:ipad'?: string;

	/**
	 * Your app’s custom URL scheme
	 *
	 * Used with app card
	 */
	'twitter:app:url:ipad'?: string;

	/**
	 * Name of your Android app
	 *
	 * Used with app card
	 */
	'twitter:app:name:googleplay'?: string;

	/**
	 * Your app’s custom URL scheme
	 *
	 * Used with app card
	 */
	'twitter:app:url:googleplay'?: string;
};

type TwitterCardTypes = 'summary' | 'summary_large_image' | 'app' | 'player';

type Twitter = TwitterSummaryCard | TwitterSummaryLargeCard | TwitterPlayerCard | TwitterAppCard;
