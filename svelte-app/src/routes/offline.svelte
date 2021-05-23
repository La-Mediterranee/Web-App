<script lang="ts">
	let online = true;

	function reloadPage(e: Event) {
		window.location.reload();
	}

	async function checkNetwork() {
		try {
			const res = await fetch('.');
			if (res.status >= 200 && res.status < 500) {
				window.location.reload();
				return;
			}
		} catch (error) {
			// Do nothing because we are offline
		}
	}

	setTimeout(checkNetwork, 2500);
</script>

<svelte:window on:online={reloadPage} />

<style>
	/* your styles go here */
</style>
