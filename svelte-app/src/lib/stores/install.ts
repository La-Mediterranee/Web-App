import message from './message';
import { writable } from 'svelte/store';

import type { Readable, Subscriber, Unsubscriber } from 'svelte/store';

declare type Invalidator<T> = (value?: T) => void;

export interface InstallStore {
	subscribe: (
		this: void,
		run: Subscriber<boolean>,
		invalidate?: Invalidator<boolean>
	) => Unsubscriber;
	install: () => Promise<boolean>;
	set: (this: void, value: boolean) => void;
}

export function createInstallStore(installSource: string): InstallStore {
	let deferedPrompt: BeforeInstallPromptEvent | null;

	const { subscribe, set } = writable(false);

	async function install(): Promise<boolean> {
		const promptEvent = deferedPrompt;

		if (!promptEvent) {
			let isInstallable: boolean = false;
			subscribe((x) => (isInstallable = x))();

			if (!isInstallable) {
				message.set({
					text: [
						'This application is not installable.',
						"Perhaps you've already installed it or the origin domain is not secure?"
					]
				});
			} else if (
				!['127.0.0.1', 'localhost'].includes(location.hostname) &&
				!location.protocol.startsWith('https')
			) {
				message.set({
					text: 'You cannot install a Progressive Web Application from a non secure domain.'
				});
			} else {
				message.set({ text: 'Unknown error.' });
			}

			return false;
		}

		promptEvent.prompt();

		const { outcome } = await promptEvent.userChoice;

		console.log(`User ${outcome} the A2HS prompt`);

		deferedPrompt = null;

		return outcome === 'accepted';
	}

	window.addEventListener('beforeinstallprompt', (e) => {
		// Prevent Chrome 67 and earlier from automatically showing the prompt
		e.preventDefault();
		deferedPrompt = e as BeforeInstallPromptEvent;
		set(true);
	});

	window.addEventListener('appinstalled', () => {
		set(false);
		// Clear the deferredPrompt so it can be garbage collected
		deferedPrompt = null;

		if (document.visibilityState !== 'visible') {
			return;
		}

		// Optionally, send analytics event to indicate successful install
		console.log('PWA was installed');
		const source = installSource || 'browser';
		ga('send', 'event', 'pwa-install', 'installed', source);
	});

	return {
		subscribe,
		install,
		set
	};
}
