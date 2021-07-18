<script lang="ts">
	import { onMount } from 'svelte';

	import { Wave } from '$lib/Icons';
	import { SHOP_LOGO } from '$lib/utils/constants';
	import ProductCard from '$lib/components/ProductCard';

	// import Carousel from '$lib/Carousel.svelte';w
	// import SliderItem from '$lib/components/Slider/SliderItem.svelte';
	// import {Carousel,CarouselItem} from '$lib/components/Carousel';

	const burger: Product = {
		name: 'Hamburger',
		price: 4.5,
		image: { src: '/burger.png', alt: 'Bild von einem Burger' }
	};

	const list = Array(10).fill(burger);
</script>

<svelte:head>
	<title>Essen Liferapp!</title>
</svelte:head>

<div>
	<div class="head">
		<img decoding="async" src={SHOP_LOGO} alt="" height="512" width="918" />
		<h1>Herzlich Willkomen!</h1>
	</div>
	<Wave />
</div>

<!-- <section class="loloRow">
	<h2 class="row-header">Essen</h2>
	<Carousel>
		{#each list as image, i}
			<CarouselItem>
				<ProductCard {image} style="width: var(--carousel-item);" />
			</CarouselItem>
		{/each}
	</Carousel>
</section> -->
<section>
	<h2 class="row-header">Essen</h2>
	<ProductCard product={burger} style="min-width: 220px; max-width: 250px;" />
</section>

<section>
	<h2>Getränke</h2>
</section>

<style lang="scss">
	:global {
		.loloRow {
			// margin: 3vw 0;
			// padding: 0;
			padding: 0 4%;
			font-size: 1.35rem;
		}
	}

	h1 {
		margin-top: 1em;
		text-transform: uppercase;
	}

	section {
		padding: 0 1.2em;
		margin-bottom: 1em;
	}

	.head {
		// background: linear-gradient(to right, var(--top1), var(--top2));
		background: var(--theme-app-bar);
		padding-bottom: 3.5em;
		text-align: center;

		img {
			margin: 2em 0 0;
			width: min(100%, 490px);
			height: min(83%, 280px);
		}
	}

	.row-header {
		line-height: 1.3;
	}
</style>
