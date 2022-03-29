<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';
	import CardText from 'svelty-material/components/Card/CardText.svelte';
	import CardTitle from 'svelty-material/components/Card/CardTitle.svelte';
	import Link from 'svelty-material/components/Button/Link.svelte';
	import ProductTile from '$lib/components/ProductTile/ProductTile.svelte';

	export let res: any;
</script>

<div class="wrapper">
	{#each res as recipe, i (recipe.label)}
		<div class="product">
			<ProductTile product={recipe} />
		</div>
	{/each}
</div>

<style lang="scss">
	@use 'variables' as *;

	// li {
	// 	list-style: none;
	// 	text-align: center;
	// }

	.wrapper {
		--wrapper-padding: 0.7em 0.5em;
		padding: var(--wrapper-padding);

		display: grid;
		gap: 1em;
		justify-content: center;
		margin-block-end: 1em;

		@media screen and (min-width: 870px) {
			position: relative;
			grid-template-columns: repeat(2, 1fr);
		}

		@media screen and (min-width: 1220px) {
			position: relative;
			grid-template-columns: repeat(3, 1fr);
		}

		@media screen and (min-width: 1600px) {
			position: relative;
			grid-template-columns: repeat(4, 1fr);
			max-width: 2000px;
			margin-inline-start: auto;
			margin-inline-end: auto;
		}
	}
</style>
