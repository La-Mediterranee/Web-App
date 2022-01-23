<!-- <svelte:options immutable tag="product-component" /> -->
<script context="module" lang="ts">
	import star from '$lib/Icons/outline/star';

	import { getProductModalContext } from '$lib/utils/helper';

	import type { Product } from 'types/product';
</script>

<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Link from 'svelty-material/components/Button/Link.svelte';
	import CardTitle from 'svelty-material/components/Card/CardTitle.svelte';

	export let product: Product;
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';
	export let style: string = '';
	export let isVisible = true;

	let tabindex = 0;
	let container: HTMLElement;

	const modal = getProductModalContext();

	const { image, name, price, sku, rating, categories } = product;

	const action = `/products${categories != null ? '/' + categories[0] : ''}/${name}`;

	const _price = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(price);

	const ratingAriaLabel = `Bewertung: ${rating?.value}/5`;

	function openPopUp(e: Event) {
		e.preventDefault();
		modal.open(product);
	}
</script>

<!-- 
	An article is better for semantic because a product card 
	is self contained and can be taken out of the page 
	and still make sense. "mediamarkt.at" also uses it for their
	cards. 

	other resources:
	- https://stackoverflow.com/questions/46259821/which-html5-tags-are-semantically-correct-to-represent-e-commerce-products

 -->
<article
	bind:this={container}
	class="product-card-container"
	tabindex={isVisible ? 0 : -1}
	on:focus={() => (tabindex = 0)}
	on:blur={() => (tabindex = -1)}
	{action}
	{style}
	itemscope
	itemtype="http://schema.org/Product"
>
	<Card raised>
		<div class="inner-card">
			<img
				class="ml-auto"
				decoding="async"
				loading="lazy"
				src={image.src}
				alt={image?.alt || name}
				width="250"
				height="181"
			/>

			<CardTitle itemprop="name" class="justify-center h4">
				{name}
			</CardTitle>

			<div class="content">
				<p class="price">
					<!-- <span content="EUR">€</span> -->
					<data class="price" value={`${price}`}>{_price}</data>
				</p>

				{#if rating}
					<div class="ratings">
						<meter
							min="0"
							max="5"
							value={`${rating?.value ?? 0}`}
							aria-label={ratingAriaLabel}
						>
							{#each Array(5).fill('star') as _}
								<Icon path={star} />
							{/each}
						</meter>

						<span>{rating?.count ?? 0}</span>
					</div>
				{/if}
			</div>

			<div class="actionsContainer">
				<svg
					class="wave"
					viewBox="0 0 400 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M0.222221 0C50.2222 0 50.0002 25 100 25C150 25 150.222 4.86802e-06 200.223 0C250.224 -4.86802e-06 249.999 25 300 25C350.001 25 350.222 1.52588e-05 400.223 0C450.224 -1.52588e-05 400.223 250 400.223 250H0.222221C0.222221 250 -49.7778 0 0.222221 0Z"
						fill="#278CC5"
					/>
				</svg>

				<div class="card-actions">
					<!-- class="orange darken-4 ma-auto" -->
					<Link
						href=""
						class="form-elements-color ma-auto"
						ariaHasPopup="dialog"
						text
						rounded
						{tabindex}
						on:click={openPopUp}
					>
						<span class="add-to-cart-text">In den Warenkorb</span>
					</Link>
				</div>
			</div>
		</div>
	</Card>
</article>

<style lang="scss" global>
	article,
	div {
		position: relative;
	}

	.red.darken-5 {
		// background-color: #e32a00 !important;
		// border-color: #e32a00 !important;
		background-color: #dd3900 !important;
		border-color: #dd3900 !important;
	}

	.product-card-container {
		flex: 0 0 auto;
		outline: none;
		position: relative;
		height: var(--product-card-height, 100%);

		* {
			text-align: center;
		}

		:global(.s-card-title) {
			// padding: 0 1em;
			padding: 0;
		}

		.inner-card {
			overflow: hidden;
			z-index: 1;
		}

		img {
			width: 100%;
			transition: transform 500ms ease;
		}

		meter {
			background: none;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			color: white;
			display: inline-block;
			border: 1px solid #ccc;
			padding: 5px;
			border-radius: 5px;
			margin: 0 10px;
			width: auto;
			height: auto;
			overflow: hidden;

			&::-webkit-meter-bar,
			&::-webkit-meter-inner-element {
				background: none;
			}
		}

		::-moz-meter-bar {
			-moz-appearance: none;
		}

		.add-to-cart-text {
			// color: #191818;
			color: #fff;
			// color: #503604;
			font-size: 1.36em;
			font-weight: 600;
		}

		.card-actions {
			display: flex;
			padding: 0.7em;
			opacity: 1;
			z-index: 5;
		}

		.actionsContainer {
			width: 100%;
			padding-top: 2em;
			position: relative;
			overflow: hidden;
			border-bottom-left-radius: var(--theme-card-border-radius);
			border-bottom-right-radius: var(--theme-card-border-radius);
		}

		.wave {
			position: absolute;
			top: 0px;
			left: 0;
			width: 200%;
			animation: wave linear 3s infinite;
		}

		.content {
			width: 100%;
			color: var(--theme-text-secondary);
			font-size: 0.875rem;
			font-weight: 400;
			line-height: 1.375rem;
			letter-spacing: 0.0071428571em;
			padding: 0.4em 1em 1em 1em;
		}

		.price {
			font-size: 1.2rem;
			padding: 0 0 0.3em 0;
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.product-card-container {
			img {
				margin-bottom: 10px;
			}

			.actionsContainer {
				position: absolute;
				visibility: hidden;
				transition: transform 750ms ease, visibility 750ms ease;
				// padding-top: 4.2em;
			}

			.wave {
				position: absolute;
				top: 0;
				left: 0;
				width: 200%;
				animation: wave linear 3s infinite;
				animation-play-state: paused;
			}

			&:focus-visible {
				box-shadow: 0 0 0 0.25rem var(--theme-focus-visible);
				border-radius: var(--theme-card-border-radius);
			}

			&:hover,
			&:focus-within {
				img {
					transform: scale(1.1);
				}

				.actionsContainer {
					transform: translateY(-100%);
					visibility: visible;
				}

				.wave {
					@media (prefers-reduced-motion: no-preference) {
						animation-play-state: running;
					}
				}
			}
		}
	}

	@keyframes wave {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(-50%);
		}
	}
</style>
