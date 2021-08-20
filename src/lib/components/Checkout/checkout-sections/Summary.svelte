<script lang="ts">
	import TextField from 'svelte-material-components/src/components/TextField';
	import Button from 'svelte-material-components/src/components/Button/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	export let value: number[];
	export let currentValue = 2;
	const dispatch = createEventDispatcher();
</script>

<form action="/checkout/finish">
	<!-- dif -->

	<Button
		type="submit"
		on:click={() => {
			value = [1];
			currentValue = 1;
		}}
	>
		Zurück zu den Zahlungdetails
	</Button>
	<Button type="submit" on:click={() => (value = [2])}>
		Bestellung bestätigen
	</Button>
</form>
