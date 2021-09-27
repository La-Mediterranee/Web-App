<script context="module" lang="ts">
	export const prerender = true;
	import { onMount } from 'svelte';
</script>

<script lang="ts">
	let counter = 3;
	let indicator: HTMLSpanElement;

	onMount(() => {
		window.setInterval(count, 800);
		checkNetworkAndReload();
	});

	function count() {
		--counter;
		if (counter === 0) {
			indicator.innerText = '...';
			return;
		}

		if (counter === -1) {
			counter = 3;
		}

		indicator.innerText = `${counter}`;
	}

	// Check if the server is responding and reload the page if it is.
	// This handles the case when the device is online, but the server
	// is offline or misbehaving.
	async function checkNetworkAndReload() {
		try {
			const response = await fetch('.');
			// Verify we get a valid response from the server
			if (response.status >= 200 && response.status < 500) {
				window.location.reload();
				return;
			}
		} catch {
			// Unable to connect to the server, ignore.
		}
		window.setTimeout(checkNetworkAndReload, 3500);
	}
</script>

<h1>La Mediterranee</h1>

<section>
	<h3>Sie sind derzeit Offline</h3>
	<div>
		Erneut verbinden in <span id="indicator" bind:this={indicator}>3</span>
	</div>
	<button type="button" on:click={window.location.reload}
		>⤾ Aktualisieren</button
	>
</section>

<style>
	h1 {
		font-style: italic;
		color: #373fff;
	}

	section {
		font-family: helvetica, arial, sans-serif;
		margin: 2em;
	}

	button {
		display: block;
	}
</style>
