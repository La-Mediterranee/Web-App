<script context="module" lang="ts">
	import Carousel from '$lib/components/Carousel';
	import Image from '$lib/components/Image/Image.next.svelte';
	import MenuItemCard from '$lib/components/MenuItem/MenuItemCard.svelte';
	import CarouselItem from '$lib/components/Carousel/CarouselItem.svelte';

	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { browser } from '$app/env';
	import { session } from '$app/stores';

	import { LL } from '$i18n/utils';
	import { Wave } from '$lib/Icons';
	import { SHOP_LOGO } from '$utils/constants';
	import { cart, formatPrice } from '$lib/stores/cart';
	import { getModalContext } from '$lib/components/Modals';

	import type { CartItem, MenuItem } from 'types/product';

	import type { HomepageProps } from '../routes/api/homepage';

	const cardActionText = derived(LL, $LL => {
		const table = Object.create(null, {
			true: {
				value: $LL.product.addToCart,
			},
			false: {
				value: $LL.product.chooseOptions,
			},
		});

		return (key: boolean) => table[`${key}`]();
	});

	// const cardActionTextMap = derived(LL, $LL => {
	// 	const table = new Map([
	// 		[true, $LL.product.addToCart],
	// 		[false, $LL.product.chooseOptions],
	// 	]);

	// 	return (key: boolean) => table.get(key)!()!;
	// });
</script>

<script lang="ts">
	export let homePageData: HomepageProps | undefined;

	const modal = getModalContext();

	const sections = homePageData?.sections || [];

	function openPopUp(e: Event, product: MenuItem) {
		console.debug(e.detail);
		if (product.toppings?.length > 0) return modal.openMenuItemModal(e.detail.item);

		cart.addItem(
			<CartItem>(<unknown>Object.assign({ quantity: 1, selectedToppings: [] }, product)),
		);
	}

	async function measure() {
		//@ts-ignore
		const result = await performance.measureUserAgentSpecificMemory();
		console.debug(result);
	}

	onMount(() => {
		console.debug(performance);
	});

	if (browser && 'measureUserAgentSpecificMemory' in performance) measure();
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
					<meta slot="list-name" itemprop="name" content={section.title} />

					{#each section.body as menuItem, i}
						{@const href = `${$session.urlLocale}/product/${menuItem.ID}`}
						{@const isVisible = itemsVisibility[i]}

						<CarouselItem
							data-visible={isVisible}
							position={i + 1}
							ariaHidden={!isVisible}
						>
							<MenuItemCard
								{href}
								{isVisible}
								itemprop="item"
								item={menuItem}
								label={{
									item: $LL.menuItem.label[menuItem.type || 'food'](),
									price: $LL.product.price(),
								}}
								on:click={e => openPopUp(e, menuItem)}
								on:info={e => modal.openInfoModal(menuItem)}
							>
								<svelte:fragment slot="name">
									{menuItem.name}
								</svelte:fragment>

								<span slot="price">
									<data itemprop="price" value={`${menuItem.price}`}>
										{formatPrice(menuItem.price)}
									</data>
									<meta itemprop="priceCurrency" content="EUR" />
								</span>

								<svelte:fragment slot="cta">
									{$cardActionText(menuItem.toppings.length === 0)}
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
		content-visibility: auto;
		contain-intrinsic-size: auto 450px;
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

		// --carousel-inner-padding: 0 0.3em;
		--carousel-item-min-width: 235px;
		--carousel-content-max-width: 1200px;

		--carousel-item-width: auto;
		--carousel-item-padding: 0 0.5em;

		--carousel-item-first-pi-start: 10px;
		--carousel-item-first-pi-end: 10px;

		--product-card-width: 250px;
		--product-card-margin-start: auto;
		--product-card-margin-end: auto;

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
