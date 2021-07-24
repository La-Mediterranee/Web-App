<script lang="ts">
	import ExpansionPanel from 'svelte-materialify/src/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from 'svelte-materialify/src/components/ExpansionPanels/ExpansionPanels.svelte';

	let value = [0];
	let customerInfo: HTMLFormElement | null = null;
</script>

<h1>Checkout</h1>

<ExpansionPanels bind:value>
	<ExpansionPanel>
		<span slot="header">1.Information</span>
		<form bind:this={customerInfo} action="/checkout-info">
			<input type="text" />
		</form>
		<button type="button" on:click={() => (value = [1])}>Weiter zur Zahlung</button>
	</ExpansionPanel>
	<ExpansionPanel disabled>
		<span slot="header">2.Zahlung</span>
		<section>
			<h3>Trinkgeld hinzufügen</h3>
			<button type="button" on:click={() => (value = [2])}>Weiter zur Zusammenfassung</button>
		</section>
	</ExpansionPanel>
	<ExpansionPanel disabled>
		<span slot="header">3.Zusammenfassung</span>
	</ExpansionPanel>
</ExpansionPanels>

<style>
	/* your styles go here */
</style>
