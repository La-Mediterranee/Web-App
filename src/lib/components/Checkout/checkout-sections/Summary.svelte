<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';

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
	<Button type="submit" on:click={() => (value = [2])}>Bestellung bestätigen</Button>
</form>
