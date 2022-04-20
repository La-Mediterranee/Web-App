<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let value: number[];
	export let currentValue = 2;
	export let translations: TranslationFunctions['checkout']['summary'];
</script>

<form action="./checkout/finish" on:submit|preventDefault>
	<!-- dif -->

	<div class="actions">
		<Button type="submit" on:click={() => (value = [(currentValue = 2)])}>
			{translations.next()}
		</Button>
		<Button
			type="submit"
			formaction="./checkout?prev=1"
			on:click={() => (value = [(currentValue = 1)])}
		>
			{translations.prev()}
		</Button>
	</div>
</form>

<style lang="scss">
	@use 'variables' as *;

	.actions {
		display: flex;
		flex-wrap: wrap;
	}

	@media (min-width: (map-get($map: $breakpoints, $key: md) + 100px)) {
		.actions {
			flex-direction: row-reverse;
		}
	}
</style>
