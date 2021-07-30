<script lang="ts">
	import { browser } from '$app/env';
	import { onDestroy, onMount } from 'svelte';

	import { createInstallStore } from '$lib/stores/install';

	import type { InstallStore } from '$lib/stores/install';
	import type { Unsubscriber } from 'svelte/store';

	export let installSource: string;

	let store: InstallStore;
	let unsub: Unsubscriber;
	let showInstallPromo: boolean;

	if (browser) {
		console.log(browser);
		store = createInstallStore(installSource);
		unsub = store.subscribe((v) => (showInstallPromo = v));
	}

	if (browser) {
		onDestroy(() => unsub());
	}

	async function installPWA(_e: Event) {
		if (await store.install()) {
			store.set(false);
		}
	}
</script>

{#if showInstallPromo}
	<div>
		<button type="button" on:click={installPWA}> Install </button>
	</div>
{/if}

<style>
	/* your styles go here */
</style>
