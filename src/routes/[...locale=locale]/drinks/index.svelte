<script lang="ts">
	import MenuItemCard from '$lib/components/MenuItem/MenuItemCard.svelte';

	export let drinks: any[];

	const header = 'Drinks';
</script>

<h1>{header}</h1>
<div>
	{#each drinks as drink}
		<MenuItemCard style="flex: 0 1 32%;" product={drink} />
	{/each}
</div>

<style lang="scss">
	h1 {
		padding-top: 0.6em;
		text-align: center;
		width: 100%;
	}

	div {
		--repeat: auto-fill;

		$drink-cars-size: 15.3125em;
		$grid-gap: 1.2em;
		$mq: calc($drink-cars-size * 4 + 3 * $grid-gap);

		display: grid;
		grid-template-columns: repeat(var(--repeat), $drink-cars-size);

		gap: $grid-gap;
		padding: 1em 0.4em;
		justify-content: center;

		@media screen and (min-width: $mq) {
			--repeat: 4;
		}

		:global(img) {
			margin-top: 1em;
			margin-bottom: 0.2em;
			object-fit: contain;
			height: 9.5em;
		}
	}
</style>
