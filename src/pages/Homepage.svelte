<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { Wave } from '$lib/Icons';
	import { SHOP_LOGO } from '$utils/constants';

	import type { HomepageProps } from '../routes/api/homepage';
</script>

<script lang="ts">
	import t from '$i18n/i18n-svelte';
	import Siema from '$components/Siema';
	import ProductCard from '$components/ProductCard';

	import { rtl } from '$stores/rtl';
	import { session } from '$app/stores';

	export let homePageData: HomepageProps | undefined;

	onMount(() => {
		document.documentElement.style.setProperty(
			'--header-position',
			'fixed'
		);

		return () => {
			document.documentElement.style.setProperty(
				'--header-position',
				'sticky'
			);
		};
	});

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

{#each sections as section}
	<section>
		<h2 class="row-header">{section.title}</h2>
		<div class="section-carousel">
			{#if Array.isArray(section.body)}
				<Siema
					rtl={$session.rtl}
					items={section.body}
					let:item={product}
					let:visible
				>
					<ProductCard {product} isVisible={visible} />
				</Siema>
			{/if}
		</div>
	</section>
{/each}

<style lang="scss">
	:global(:root) {
		--header-position: fixed;
	}

	h1 {
		margin-top: 1em;
		text-transform: uppercase;
	}

	section {
		padding: 0 1.2em;
		margin-bottom: 1em;

		div {
			> :global(*) {
				margin: 0.5em;

				&:first-child {
					margin-inline-start: 0;
				}

				&:last-child {
					margin-inline-end: 0;
				}
			}
		}
	}

	.banner {
		padding-top: 2.2em;
	}

	.section-carousel {
		--siema-item-min-width: 240px;
		--siema-item-max-width: 240px;

		@media screen and (min-width: 500px) {
			--siema-item-width: 50%;
		}

		@media screen and (min-width: 900px) {
			--siema-item-width: 35%;
		}

		@media screen and (min-width: 1200px) {
			--siema-item-width: min(35%, 210px);
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
