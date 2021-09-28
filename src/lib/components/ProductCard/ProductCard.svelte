<svelte:options immutable={true} />

<script lang="ts">
	import { afterUpdate } from 'svelte';
	import Card from 'svelte-material-components/src/components/Card/Card.svelte';
	import Chip from 'svelte-material-components/src/components/Chip/Chip.svelte';
	import Icon from 'svelte-material-components/src/components/Icon/Icon.svelte';
	import Button from 'svelte-material-components/src/components/Button/Button.svelte';
	import CardTitle from 'svelte-material-components/src/components/Card/CardTitle.svelte';

	import { getProductModalContext } from '$lib/utils/helpers';
	import LDTag from '../LDTag';
	import star from '$lib/Icons/outline/star';
	import flash from '$lib/utils/flash';

	import type { WithContext, Product as DTSProduct } from 'schema-dts';
	import type { Product } from 'types/interfaces';

	export let product: Product;
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';
	export let style: string;

	let tabindex = -1;
	let container: HTMLFormElement;

	const { open } = getProductModalContext();

	const { image, name, price, sku, rating, categories } = product;

	const action = `/products${
		categories != null ? '/' + categories[0] : ''
	}/${name}`;

	const _price = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(price);

	const ratingAriaLabel = `Bewertung: ${rating?.value}/5`;

	const jsonLd: WithContext<DTSProduct> = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		image: image.src,
		name: name,
		sku: sku,
		offers: {
			'@type': 'Offer',
			price: price,
			priceCurrency: 'EUR',
			availability: 'https://schema.org/InStock',
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: rating?.value,
			reviewCount: rating?.count,
		},
	};

	afterUpdate(() => {
		flash(container as HTMLFormElement);
	});

	function openPopUp(e: Event) {
		console.log(e);
		// open({
		// 	Component: Chip,
		// 	props: {
		// 		slot: 'hi',
		// 	},
		// });
	}
</script>

<LDTag schema={jsonLd} />

<form
	bind:this={container}
	class="card-container"
	tabindex="0"
	method="GET"
	on:focus={() => (tabindex = 0)}
	on:blur={() => (tabindex = -1)}
	on:submit|preventDefault={openPopUp}
	{action}
	{style}
>
	<Card raised>
		<div class="inner-card">
			<!-- style="background-image: url('https://images.placeholders.dev/?width=1055&height=100&text=%22%20%22&bgColor=%23f7f6f6&textColor=%236d6e71');" -->
			<img
				class="ml-auto"
				decoding="async"
				loading="lazy"
				src={image?.src}
				alt={image?.alt || name}
				width="250"
				height="181"
			/>
			<CardTitle itemprop="name" class="justify-center h4">
				{name}
			</CardTitle>

			<div class="content">
				<div class="price">
					<!-- <span content="EUR">€</span> -->
					<span class="price" content={`${_price}`}>{_price}</span>
				</div>

				{#if rating}
					<div class="ratings">
						<meter
							min="0"
							max="5"
							value={`${rating?.value ?? 0}`}
							aria-label={ratingAriaLabel}
						>
							{#each Array(5).fill('star') as _star}
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
					<Button
						type="submit"
						{tabindex}
						aria-haspopup="dialog"
						class="orange darken-1 ma-auto"
						text
						rounded
					>
						In den Warenkorb
					</Button>
				</div>
			</div>
		</div>
	</Card>
</form>

<style lang="scss">
	* {
		text-align: center;
	}

	img {
		width: 100%;
		transition: transform 500ms ease;
	}

	form,
	div {
		position: relative;
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

	.card-actions {
		display: flex;
		padding: 0.7em;
	}

	.actionsContainer {
		width: 100%;
		// padding-top: 1.25em;
		padding-top: 2em;
		position: relative;
		overflow: hidden;
	}

	.wave {
		position: absolute;
		top: 0px;
		left: 0;
		width: 200%;
		animation: wave linear 3s infinite;

		@media (prefers-reduced-motion) {
			animation-play-state: paused;
		}
	}

	.card-container {
		flex: 0 0 auto;
		outline: none;

		:global(.s-card-title) {
			// padding: 0 1em;
			padding: 0;
		}
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

	@media (prefers-reduced-motion) {
		.wave {
			animation-play-state: paused;
		}
	}

	@media (hover: hover) and (pointer: fine) {
		img {
			margin-bottom: 10px;
		}

		.inner-card {
			overflow: hidden;
		}

		.card-container {
			// :global(.s-card-title) {
			// 	padding: 16px;
			// }

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
					opacity: 1;
					transform: translateY(-100%);
				}

				.wave {
					animation-play-state: running;
				}
			}
		}

		.wave {
			position: absolute;
			top: 0;
			left: 0;
			width: 200%;
			animation: wave linear 3s infinite;
			animation-play-state: paused;
		}

		.actionsContainer {
			position: absolute;
			transition: transform 750ms ease;
			// padding-top: 4.2em;
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
