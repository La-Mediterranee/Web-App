/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="google.analytics" />
/// <reference types="gtag.js" />
/// <reference types="@stripe/stripe-js" />

type Invalidator<T> = (value?: T) => void;

type USVString = string;

var opr: string;
var chrome: string;

declare var dataLayer = [];

declare module experimental {
	interface Navigator {
		static setAppBadge(contents?: number): Promise<void>;
	}
}

// var Stripe: Stripe;
/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * Only supported on Chrome and Android Webview.
 */
interface BeforeInstallPromptEvent extends Event {
	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>;

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;
}

interface PushSubscriptionChangeEvent extends ExtendableEvent {
	readonly newSubscription: PushSubscription;
	readonly oldSubscription: PushSubscription;
}

interface PasswordCredentialData extends Credential {
	id: USVString;
	password: USVString;
	name?: USVString;
	iconURL?: USVString;
}

interface PasswordCredential extends Credential {
	readonly iconURL: USVString;
	readonly name: USVString;
	readonly password: USVString;
}

declare var PasswordCredential: {
	prototype: PasswordCredential;
	new (htmlFormElement: HTMLFormElement): PasswordCredential;
	new (passwordCredentialData: PasswordCredentialData): PasswordCredential;
};
