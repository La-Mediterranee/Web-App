<script lang="ts">
	import { onMount } from 'svelte';

	let show = false;
	let deferedPrompt: BeforeInstallPromptEvent;
	let showInstallPromo = false;

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
			e.preventDefault();
			deferedPrompt = e;
			showInstallPromo = true;
			show = true;
			// showInstallPromo();
			// ga('send', 'event', {
			// 	eventCategory: 'pwa-install',
			// 	eventAction: 'promo-shown',
			// 	nonInteraction: true
			// });
		});

		window.addEventListener('appinstalled', () => {
			// Hide the app-provided install promotion
			showInstallPromo = false;
			// Clear the deferredPrompt so it can be garbage collected
			deferedPrompt = null;
			// Optionally, send analytics event to indicate successful install
			console.log('PWA was installed');
		});
	});

	async function installPWA(_e: Event) {
		// Add code show install prompt & hide the install button.
		const promptEvent = deferedPrompt;
		if (!promptEvent) {
			// The deferred prompt isn't available.
			return;
		}
		promptEvent.prompt();
		// Log user response to prompt.
		const choice = await promptEvent.userChoice;
		console.log(`User ${choice.outcome} the A2HS prompt`);

		deferedPrompt = null;
		// Hide the install button, it can't be called twice.
		show = true;
	}
</script>

<div hidden={showInstallPromo}>
	<button type="button" on:click={installPWA}> Install </button>
</div>

<style>
	/* your styles go here */
</style>
