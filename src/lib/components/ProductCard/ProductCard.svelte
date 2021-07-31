<script lang="ts">
	import { Minus, Plus } from '$lib/Icons';
	import Card from 'svelte-material-components/src/components/Card/Card.svelte';
	import CardActions from 'svelte-material-components/src/components/Card/CardActions.svelte';
	import CardTitle from 'svelte-material-components/src/components/Card/CardTitle.svelte';
	import Button from 'svelte-material-components/src/components/Button/Button.svelte';
	import Chip from 'svelte-material-components/src/components/Chip/Chip.svelte';
	import LDTag from '../LDTag';

	import type { WithContext, Product as DTSProduct } from 'schema-dts';
	import Icon from 'svelte-material-components/src/components/Icon/Icon.svelte';
	import star from '$lib/Icons/outline/star';

	export let product: Product;
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';
	export let style: string;

	let tabindex = -1;

	const action = `/products${
		typeof product.categories !== 'undefined'
			? product.categories instanceof Array
				? '/' + product.categories[0]
				: '/' + product.categories
			: ''
	}/${product.name}`;

	console.log(action);

	const { image, name, price, sku, rating } = product;

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

	function openPopUp(e: Event) {
		console.log(e);
	}
</script>

<LDTag schema={jsonLd} />

<form
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
			/>
			<CardTitle itemprop="name" class="justify-center h4">
				{name}
			</CardTitle>

			<div>
				<span content="EUR">€</span>
				<span class="price" content={`${_price}`}>{_price}</span>
			</div>

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

				<CardActions>
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
				</CardActions>
			</div>
		</div>
	</Card>
</form>

<style lang="scss">
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
			padding: 0 16px;
		}
	}

	@media (pointer: fine) {
		img {
			margin-bottom: 10px;
		}

		.inner-card {
			overflow: hidden;
		}

		.card-container {
			:global(.s-card-title) {
				padding: 16px;
			}

			&:focus-visible {
				box-shadow: 0 0 0 0.25rem var(--theme-focus-visible);
				border-radius: var(--theme-card-border-radius);
			}

			&:hover,
			&:focus-visible,
			&:focus-within,
			&:focus {
				img {
					transform: scale(1.1);
				}
				.actionsContainer {
					opacity: 1;
					transform: translateY(-100%);
				}
				.wave {
					animation-play-state: running;
					@media (prefers-reduced-motion) {
						animation-play-state: paused;
					}
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
