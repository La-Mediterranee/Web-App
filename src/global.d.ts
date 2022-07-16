/* eslint-disable no-redeclare, no-unused-vars */
/// <reference types="vite/client" />
/// <reference types="google.analytics" />
/// <reference types="gtag.js" />
/// <reference types="@stripe/stripe-js" />
/// <reference types="./lib/types" />

type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };
type Attributes<T extends EventTarget> = svelte.JSX.HTMLAttributes<T>;

type USVString = string;
type UrlString = `http${'s' | ''}://${string}`;
type JwtToken = `${string}.${string}.${string}`;

declare var opr: string;
declare var chrome: string;

declare var dataLayer: unknown[] = [];

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

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onintersection?: (event: CustomEvent<HTMLElement>) => void;
	}
}

/**
 * HTMLDialogELement
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement
 */
interface HTMLDialogElement extends HTMLElement {
	/**
	 * Reflects the open HTML attribute,
	 * indicating that the dialog is available for interaction.
	 */
	open: boolean;
	/**
	 * Gets/sets the return value for the dialog.
	 */
	returnValue: string;
	/**
	 * Closes the dialog. An optional DOMString may be passed as an argument,
	 * updating the returnValue of the the dialog.
	 */
	close(): void;
	/**
	 * Displays the dialog modelessly, i.e. still allowing interaction with content outside of the dialog.
	 * An optional Element or MouseEvent may be passed as an argument,
	 * to specify an anchor point to which the dialog is fixed.
	 */
	show(): void;
	/**
	 * Displays the dialog for exclusive interaction, over the top of any other dialogs that might be present.
	 * An optional Element or MouseEvent may be passed as an argument,
	 * to specify an anchor point to which the dialog is fixed.
	 */
	showModal(): void;
}

// https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
interface NetworkInformation {
	readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
}
