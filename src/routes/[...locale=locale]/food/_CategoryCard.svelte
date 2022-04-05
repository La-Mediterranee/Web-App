<script lang="ts">
	import Image from '$lib/components/Image/Image.next.svelte';

	import Card from 'svelty-material/components/Card/Card.svelte';

	export let category: string;
	export let inTransition: (
		node: HTMLElement,
		options: Record<string, unknown>,
	) => SvelteTransitionReturnType = () => ({});
</script>

<div in:inTransition class="category">
	<Card>
		<a href="./food/{category.toLowerCase()}">
			<Image
				layout="responsive"
				objectFit="scale-down"
				objectPosition="center"
				height={294}
				width={437}
				src="/burger.png"
				alt=""
			/>
			<span>
				{category}
			</span>
		</a>
	</Card>
</div>

<style lang="scss">
	@import 'svelty-material/styles/tools/colors';

	.category {
		text-align: end;
		position: relative;
		flex: 0 1 var(--category-card-width, 100%);

		:global(.s-card) {
			height: inherit;
			margin: 0.7em 0.4em;
		}

		span {
			color: material-color('cyan', 'accent-1');
			position: absolute;

			top: 20px;
			right: 20px;
			font-size: 2em;
			font-weight: bold;
			text-transform: uppercase;
		}

		@media screen and (min-width: 540px) {
			--category-card-width: 50%;

			&:nth-child(2n) {
				text-align: start;

				span {
					top: unset;
					right: unset;
					left: 20px;
					bottom: 20px;
				}
			}
		}
	}

	@media screen and (min-width: 850px) {
		.category {
			--category-card-width: 33%;

			&:nth-child(4n + 3),
			&:nth-child(4n + 4) {
				:global(.card-content) {
					flex-direction: row-reverse;
				}
			}
		}
	}

	@media screen and (min-width: 1200px) {
		.category {
			--category-card-width: 25%;
		}
	}
</style>
