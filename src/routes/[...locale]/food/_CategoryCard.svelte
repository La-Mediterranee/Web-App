<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';
	import CardText from 'svelty-material/components/Card/CardText.svelte';
	import CardTitle from 'svelty-material/components/Card/CardTitle.svelte';
	import Link from 'svelty-material/components/Button/Link.svelte';

	export let category: string;
</script>

<div class="category">
	<Card>
		<a href="./food/{category}">
			<img src="/burger.png" alt="" />
			<span>
				{category}
			</span>
		</a>
	</Card>
</div>

<style lang="scss">
	@import 'svelty-material/styles/tools/colors';

	.category {
		position: relative;
		flex: 0 1 50%;

		:global(.s-card) {
			height: inherit;
			margin: 0.7em 0.4em;
		}

		img {
			height: auto;
			width: 100%;
		}

		span {
			color: material-color('cyan', 'accent-1');
			position: absolute;

			top: 20px;
			right: 20px;
			font-size: x-large;
			font-weight: bold;
			text-transform: uppercase;
		}

		@media screen and (min-width: 600px) {
			&:nth-child(2n) {
				span {
					top: unset;
					right: unset;
					left: 20px;
					bottom: 20px;
				}
			}
		}
	}

	@media screen and (min-width: 1200px) {
		.category {
			&:nth-child(4n + 3),
			&:nth-child(4n + 4) {
				:global(.card-content) {
					flex-direction: row-reverse;
				}
			}
		}
	}
</style>
