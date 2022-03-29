<script context="module" lang="ts">
	import { Wave } from '$lib/Icons';
	import { SHOP_LOGO } from '$utils/constants';

	import type { HomepageProps } from '../routes/api/homepage';
</script>

<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Carousel from '$lib/components/Carousel';
	import ProductCard from '$lib/components/ProductCard';
	import MenuItemCard from '$lib/components/MenuItem/MenuItemCard.svelte';
	import CarouselItem from '$lib/components/Carousel/CarouselItem.svelte';

	import { session } from '$app/stores';

	import { cart, formatPrice } from '$lib/stores/cart';
	import { getProductModalContext } from '$lib/utils';

	import type { CartItem, MenuItem } from 'types/product';
	import Image from '$lib/components/Image/Image.next.svelte';

	export let homePageData: HomepageProps | undefined;

	const modal = getProductModalContext();

	const sections = homePageData?.sections || [];

	function openPopUp(e: Event, product: MenuItem) {
		if (product.toppings?.length > 0) return modal.open(product);

		cart.addItem(
			<CartItem>(<unknown>Object.assign({ quantity: 1, selectedToppings: [] }, product)),
		);
	}
</script>

<svelte:head>
	<title>Essen Liferapp!</title>
</svelte:head>

<div class="banner">
	<div class="head">
		<div class="hompage-logo">
			<Image
				src={SHOP_LOGO}
				alt=""
				loading="eager"
				height={512}
				width={918}
				layout="intrinsic"
				priority
			/>
		</div>
		<h1>Herzlich Willkomen!</h1>
	</div>
	<Wave />
</div>

<div class="sections">
	{#each sections as section}
		<section aria-labelledby={section.title.toLocaleLowerCase()} class="section-carousel">
			<h2 id={section.title.toLocaleLowerCase()} class="row-header">{section.title}</h2>
			{#if Array.isArray(section.body)}
				<Carousel rtl={$session.rtl} itemsLength={section.body.length} let:itemsVisibility>
					{#each section.body as menuItem, i}
						<CarouselItem ariaHidden={!itemsVisibility[i]}>
							<MenuItemCard
								href="{$session.urlLocale}/product/{menuItem.ID}"
								product={menuItem}
								isVisible={itemsVisibility[i]}
								label={{
									item: $LL.menuItem.label[menuItem.type || 'food'](),
									price: $LL.product.price(),
								}}
								on:click={e => openPopUp(e, menuItem)}
							>
								<svelte:fragment>
									{menuItem.name}
								</svelte:fragment>

								<data slot="price" itemprop="price" value={`${menuItem.price}`}>
									{formatPrice(menuItem.price)}
								</data>

								<svelte:fragment slot="cta">
									{menuItem.toppings?.length > 0
										? $LL.product.chooseOptions()
										: $LL.product.addToCart()}
								</svelte:fragment>
							</MenuItemCard>
						</CarouselItem>
					{/each}
				</Carousel>
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

		--carousel-item-first-pi-start: 10px;
		--carousel-item-first-pi-end: 10px;

		@media screen and (min-width: 820px) {
			--product-card-width: 100%;
			--carousel-item-width: 33.3%;
		}

		@media screen and (min-width: 1150px) {
			--carousel-item-width: 25%;
		}

		@media screen and (min-width: 1220px) {
			align-self: center;
		}
	}

	.head {
		// background: linear-gradient(to right, var(--top1), var(--top2));
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--theme-app-bar);
		padding-bottom: 3.5em;

		:global(.hompage-logo) {
			position: relative;
			margin-block-start: 2em;
			text-align: center;
			width: 100%;
			max-width: 490px;
			max-height: 280px;
		}
	}

	.row-header {
		line-height: 1.3;
		margin-inline-start: 1.5em;
	}
</style>
