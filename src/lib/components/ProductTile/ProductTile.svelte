<script lang="ts">
	import { session } from '$app/stores';

	import Link from 'svelty-material/components/Button/Link.svelte';
	import Card from 'svelty-material/components/Card/Card.svelte';

	export let product: any;
</script>

<Card raised>
	<div class="card-content">
		<div class="img-container">
			<img src={product.image} decoding="async" width="300" height="300" alt="background" />
		</div>

		<div style="flex: 1; display: flex; flex-direction: column;">
			<div class="text-container">
				<h2 class="product-name">
					<span class="no-js-hidden">
						{product.label}
					</span>
					<noscript>
						<a href="/product/{product.label}">
							{product.label}
						</a>
					</noscript>
				</h2>
				<!-- <p style=""> -->
				<p class="product-desc">
					<span>
						{product.ing}
					</span>
				</p>
			</div>
			<div style="justify-self: flex-end; padding: 1em; flex: 0 0 auto; align-self: center">
				<Link
					role="button"
					href="{$session.urlLocale}/product/{product.label}"
					class="form-elements-color"
					ariaHasPopup="dialog"
					rounded
					on:click={() => {}}
				>
					<span>In den Warenkorb</span>
				</Link>
			</div>
		</div>
	</div>
</Card>

<style lang="scss">
	a {
		text-align: center;
		width: 100%;
		text-decoration: none;
	}

	.img-container {
		border-radius: inherit;
		// display: flex;
		flex: 0 1 300px;

		img {
			width: 100%;
			height: 100%;
			border-radius: inherit;
		}
	}

	.product {
		&-name {
			padding: 0.5em 1em 0 0.5em;
			span,
			a {
				display: -webkit-box;
				text-overflow: ellipsis;
				hyphens: auto;

				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}

		&-desc {
			height: 100%;
			padding: 0 1em;
			display: flex;
			align-content: center;

			span {
				text-overflow: ellipsis;
				hyphens: auto;
				overflow: hidden;
				align-self: center;
				display: -webkit-box;
				-webkit-line-clamp: 5;
				-webkit-box-orient: vertical;
			}
		}
	}

	@media screen and (min-width: 570px) {
		.card-content {
			display: flex;
			text-align: center;
		}

		.text-container {
			flex: 1 1 auto;
			max-width: 100%;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}
	}
</style>
