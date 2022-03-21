<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { Wave } from '$lib/Icons';
	import { SHOP_LOGO } from '$utils/constants';

	import type { HomepageProps } from '../routes/api/homepage';
</script>

<script lang="ts">
	import t from '$i18n/i18n-svelte';
	import Siema from '$lib/components/Carousel';
	import ProductCard from '$components/ProductCard';

	import { rtl } from '$stores/rtl';
	import { session } from '$app/stores';
	import MenuItemCard from '$lib/components/MenuItem/MenuItemCard.svelte';

	export let homePageData: HomepageProps | undefined;

	const sections = homePageData?.sections || [];
</script>

<svelte:head>
	<title>Essen Liferapp!</title>
</svelte:head>

<div class="banner">
	<div class="head">
		<img decoding="async" src={SHOP_LOGO} alt="" height="512" width="918" />
		<h1>Herzlich Willkomen!</h1>
	</div>
	<Wave />
</div>

<div class="sections">
	{#each sections as section}
		<section aria-labelledby={section.title.toLocaleLowerCase()} class="section-carousel">
			<h2 id={section.title.toLocaleLowerCase()} class="row-header">{section.title}</h2>
			{#if Array.isArray(section.body)}
				<Siema rtl={$session.rtl} items={section.body} let:item={product} let:visible>
					<MenuItemCard {product} isVisible={visible} />
				</Siema>
			{/if}
		</section>
	{/each}
</div>

<style lang="scss">
	h1 {
		margin-top: 1em;
		text-transform: uppercase;
	}

	section {
		margin-bottom: 1em;
	}

	.banner {
		// padding-top: 2.2em;
		transform: translateY(-1em);
	}

	.sections {
		display: flex;
		flex-direction: column;
	}

	.section-carousel {
		max-width: 1200px;
		--product-card-width: 250px;

		--carousel-item-min-width: 235px;
		--carousel-content-max-width: 1200px;
		--product-card-margin-start: auto;
		--product-card-margin-end: auto;

		--carousel-item-width: auto;
		--carousel-item-padding: 0 0.5em;

		// @media screen and (min-width: 600px) {
		// 	--carousel-item-width: 50%;
		// }

		@media screen and (min-width: 820px) {
			--carousel-item-width: 33.3%;
		}

		@media screen and (min-width: 1150px) {
			--carousel-item-width: 25%;
		}

		:global(.item) {
			// --carousel-content-padding: 0 14px;

			&:first-child {
				padding-inline-start: 10px;
			}

			&:last-child {
				padding-inline-end: 10px;
			}
		}

		@media screen and (min-width: 1220px) {
			align-self: center;
			// margin: 0 auto;
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
		}
	}

	.row-header {
		line-height: 1.3;
		margin-inline-start: 1.5em;
	}
</style>
