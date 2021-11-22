<script></script>

<!-- empty file. This file never get's accessed, since '__layout.svelte' will make a redirect to a subpath -->

<!-- <script context="module" lang="ts">
	import { Wave } from '$lib/Icons';
	import { SHOP_LOGO } from '$utils/constants';

	import type { HomepageProps } from './homepage.json';

	import type { Product } from 'types/product';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load({ fetch }: LoadInput) {
		const url = `/homepage.json`;
		const homePageData = (await fetch(url).then((p) => p.json())) as HomepageProps;

		return {
			props: { homePageData },
		};
	}
</script>

<script lang="ts">
	import SlideGroup from 'svelte-material-components/src/components/SlideGroup/SlideGroup.svelte';
	import SlideItem from 'svelte-material-components/src/components/SlideGroup/SlideItem.svelte';

	import ProductCard from '$components/ProductCard';

	export let homePageData: HomepageProps | undefined;

	const sections = homePageData?.sections || [];
</script>

<svelte:head>
	<title>Essen Liferapp!</title>
</svelte:head>

<div style="padding-top: 2.2em;">
	<div class="head">
		<img decoding="async" src={SHOP_LOGO} alt="" height="512" width="918" />
		<h1>Herzlich Willkomen!</h1>
	</div>
	<Wave />
</div>

{#each sections as section}
	<section>
		<h2>{section.title}</h2>
		<div>
			{#if Array.isArray(section.body)}
				<SlideGroup>
					{#each section.body as bestseller}
						<SlideItem class="ptb-2" let:active>
							<ProductCard
								product={bestseller}
								style="min-width: 220px; max-width: 250px; margin: 0 10px;"
							/>
						</SlideItem>
					{/each}
				</SlideGroup>
			{/if}
		</div>
	</section>
{/each}

<style lang="scss">
	h1 {
		margin-top: 1em;
		text-transform: uppercase;
	}

	section {
		padding: 0 1.2em;
		margin-bottom: 1em;

		div {
			display: inline-flex;
			max-width: 100%;

			> :global(*) {
				margin: 0.5em;

				&:first-child {
					margin-left: 0;
				}

				&:last-child {
					margin-right: 0;
				}
			}
		}
	}

	.head {
		// background: linear-gradient(to right, var(--top1), var(--top2));
		background: var(--theme-app-bar);
		padding-bottom: 3.5em;
		text-align: center;

		img {
			margin: 2em 0 0;
			width: 100%;
			max-width: 490px;
			height: 83%;
			max-height: 280px;

			// width: min(100%, 490px);
			// height: min(83%, 280px);
		}
	}

	.row-header {
		line-height: 1.3;
	}
</style>

 -->
