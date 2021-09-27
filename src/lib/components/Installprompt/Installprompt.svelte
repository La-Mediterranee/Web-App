<script lang="ts">
	import { browser } from '$app/env';
	import { onDestroy, onMount } from 'svelte';

	import { createInstallStore } from '$lib/stores/install';

	import type { Unsubscriber } from 'svelte/store';
	import type { InstallStore } from '$lib/stores/install';

	export let installSource: string;

	let store: InstallStore;
	let unsub: Unsubscriber;
	let showInstallPromo: boolean;

	if (browser) {
		store = createInstallStore(installSource);
		unsub = store.subscribe((v) => (showInstallPromo = v));

		onDestroy(() => unsub());
	}

	async function installPWA(_e: Event) {
		if (await store.install()) {
			store.set(false);
		}
	}
</script>

{#if showInstallPromo}
	<div aria-live="polite">
		<button type="button" on:click={installPWA}> Install </button>
	</div>
{/if}

<style>
	/* your styles go here */
</style>
