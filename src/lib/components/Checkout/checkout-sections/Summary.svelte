<script lang="ts">
	import TextField from 'svelte-material-components/src/components/TextField';
	import ExpansionPanel from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanels.svelte';

	export let value: number[];
	export let currentValue = 2;
</script>

<button
	type="button"
	on:click={() => {
		value = [1];
		currentValue = 1;
	}}
>
	Zurück zu den Zahlungdetails
</button>
<button type="button" on:click={() => (value = [2])}>
	Bestellung bestätigen
</button>
