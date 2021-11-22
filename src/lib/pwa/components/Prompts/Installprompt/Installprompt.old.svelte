<script lang="ts">
	import { onMount } from 'svelte';

	export let installSource: string;

	let showInstallPromo = false;
	let deferedPrompt: BeforeInstallPromptEvent;

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
			e.preventDefault();
			deferedPrompt = e;
			showInstallPromo = true;
			// ga('send', 'event', {
			// 	eventCategory: 'pwa-install',
			// 	eventAction: 'promo-shown',
			// 	nonInteraction: true
			// });
		});

		window.addEventListener('appinstalled', () => {
			// Hide the app-provided install promotion
			if (showInstallPromo) {
				showInstallPromo = false;
			}
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
	});

	// Add code show install prompt & hide the install button.
	async function installPWA(_e: Event) {
		// Hide the install button, it can't be called twice.
		showInstallPromo = false;

		const promptEvent = deferedPrompt;
		if (!promptEvent) {
			// The deferred prompt isn't available.
			return;
		}

		promptEvent.prompt();
		// Log user response to prompt.
		const { outcome } = await promptEvent.userChoice;
		console.log(`User ${outcome} the A2HS prompt`);

		ga('send', 'event', {
			eventCategory: 'pwa-install',
			eventAction: 'promo-clicked',
			eventLabel: installSource,
			eventValue: outcome === 'accepted' ? 1 : 0,
		});

		if (outcome === 'dismissed') {
			installSource = null;
		}

		deferedPrompt = null;
	}
</script>

{#if showInstallPromo}
	<div hidden={showInstallPromo} aria-hidden={showInstallPromo}>
		<button type="button" on:click={installPWA}> Install </button>
	</div>
{/if}

<style>
	/* your styles go here */
</style>
