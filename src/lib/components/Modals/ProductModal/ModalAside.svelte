<script lang="ts">
	import type { Product } from 'types/product';

	export let product: Product;
	export let locale: string;
	export let currency: string;

	const { image, name, price, desc } = product;

	const _price = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(price);
</script>

<aside aria-labelledby="product-aside-title">
	<div class="sidebar-container">
		<div class="sidebar-img">
			<img src={image.src} alt={image.alt} />
		</div>
		<header class="info">
			<div class="header">
				<slot name="title" id="product-aside-title">
					<h1 id="product-aside-title" class="title">{name}</h1>
				</slot>
				<span class="price">
					<data value={`${price}`}>{_price}</data>
				</span>
			</div>
			{#if desc}
				<p class="description">
					{desc}
				</p>
			{/if}
		</header>
	</div>
</aside>

<style lang="scss">
	aside {
		// background-color: var(--accent-color, orange);
		background: var(--top2);
		border-radius: 0 0 1em 1em;
		padding: var(--product-modal-aside-padding);

		.sidebar-img {
			max-height: 350px;
			align-self: center;
			text-align: center;
		}

		img {
			width: 100%;
			height: auto;
			max-height: inherit;
			border-radius: 1em;
		}
	}

	.title {
		font-size: 2em;
		margin: 0.6em 0 0.4em;
	}

	.price {
		font-size: 1.5em;
		font-weight: 500;
		padding-inline-start: 0.2em;
	}

	.sidebar-container {
		display: flex;
		flex-direction: column;
		padding: var(--container-padding);
		// overflow: auto;
	}

	.description {
		margin-top: 0.6em;
	}

	$modalBP: 850px;

	@media screen and (min-width: $modalBP) {
		:global(.s-dialog) {
			aside {
				border-radius: 0;
				border-start-end-radius: 1em;
				border-end-end-radius: 1em;
			}
		}

		aside {
			flex: 0 0 var(--aside-width);
			max-width: var(--aside-width);
			height: 100vh;
			position: sticky;
			top: 0;

			:global(.s-dialog) & {
				min-height: 100vh;
			}
		}

		.title {
			font-size: 2.5em;
			text-align: center;
		}
	}
</style>
