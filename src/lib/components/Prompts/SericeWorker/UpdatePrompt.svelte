<script lang="ts">
	import Button from 'svelte-material-components/src/components/Button/Button.svelte';
	import Snackbar from 'svelte-material-components/src/components/Snackbar/Snackbar.svelte';

	const text = {
		promptText: 'Neue Version verfügbar',
		acceptText: 'Aktualisieren',
		dismissText: 'Ignorieren',
	} as const;

	export let prompt = false;
</script>

<Snackbar bind:active={prompt} bottom center>
	{text.promptText}
	<div class="mt-1">
		<Button text class="success-text">{text.acceptText}</Button>
		<Button
			class="red-text"
			text
			on:click={() => {
				prompt = false;
			}}
		>
			Dismiss
		</Button>
	</div>
</Snackbar>

<style>
	/* your styles go here */
</style>
