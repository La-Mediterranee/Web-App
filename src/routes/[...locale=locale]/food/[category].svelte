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

		.product {
			&:not(:last-child) {
				margin-bottom: 1em;
			}
		}

		@media screen and (min-width: 570px) {
			.product {
				height: 300px;
				// max-width: calc(50% - var(--wrapper-padding));

				flex: 1 0 45%;
				margin: 1.2em;

				:global(.card) {
					height: inherit;
				}
			}
		}

		@media screen and (min-width: 1000px) {
			position: relative;
			min-height: 100vh; //calc(100vh - var(--top-bar-height));

			display: flex;
			flex-wrap: wrap;

			.product {
				margin: 0.7em 0.5em;
			}
		}
	}
</style>
