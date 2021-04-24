<script lang="ts">
	import { onMount } from 'svelte';
	import ProductCard from '$lib/ProductCard.svelte';
	import Wave from '$lib/Wave.svelte';
	import Container from 'svelte-materialify/src/components/Grid/Container.svelte';
	import Row from 'svelte-materialify/src/components/Grid/Row.svelte';
	import Col from 'svelte-materialify/src/components/Grid/Col.svelte';
	import Carousel from '$lib/Carousel.svelte';
	import SliderItem from '$lib/components/Slider/SliderItem.svelte';

	const burgerImage = {
		src: '/burger.png',
		alt: 'Bild von einem Burger',
	};

	const list = Array(10).fill(burgerImage);
</script>

<svelte:head>
	<title>Food Delivery App!</title>
</svelte:head>

<div>
	<div class="head">
		<img decoding="async" src="/Logos/V1.png" alt="" height="512" width="918" />
		<h1>Herzlich Willkomen!</h1>
	</div>
	<Wave />
</div>

<section class="loloRow">
	<h2 class="row-header">Essen</h2>
	<Carousel showIndicators>
		{#each list as image, i}
			<SliderItem>
				<ProductCard {image} style="width: var(--carousel-item);" />
			</SliderItem>
		{/each}
	</Carousel>
</section>
<section>
	<h2 class="row-header">Essen</h2>
	<ProductCard image={burgerImage} style="min-width: 220px; max-width: 250px;" />
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
		padding: 0 20px;
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
