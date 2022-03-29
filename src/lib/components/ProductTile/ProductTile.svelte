<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
</script>

<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';
	import Link from 'svelty-material/components/Button/Link.svelte';

	import SmallWave from '$lib/Icons/SmallWave.svelte';

	import { session } from '$app/stores';
	import { getAnimationsContext } from '$lib/stores/animations';
	import Image from '../Image/Image.next.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	export let product: any;
	export let dataAnimation: boolean | string | undefined = undefined;

	let waveEl: SVGSVGElement;

	const animations = getAnimationsContext();

	onMount(() => {
		const unsub = animations.subscribe(() => {});
		const pop = animations.push(waveEl);

		return () => {
			pop();
			unsub();
		};
	});
</script>

<article class="product-tile">
	<Card raised>
		<div class="card-content">
			<div class="img-container">
				<Image
					src={product.image}
					layout="fill"
					width={162}
					height={200}
					alt="background"
					objectFit="fill"
				/>
			</div>

			<div class="product-content">
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
				<div class="actions">
					<SmallWave bind:el={waveEl} class="wave" />

					<div class="link">
						<form method="post" action="{$session.urlLocale}/product/{product.label}">
							<Button
								class="form-elements-color"
								ariaHasPopup="dialog"
								rounded
								on:click={() => {}}
							>
								<span
									style="font-weight: 700; font-size: 1.2em; letter-spacing: 0.05em;"
									>In den Warenkorb</span
								>
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</Card>
</article>

<style lang="scss">
	a {
		text-align: center;
		width: 100%;
		text-decoration: none;
	}

	.img-container {
		position: relative;
		border-radius: inherit;
		overflow: hidden;
		flex: 0 1 200px;
		z-index: 1;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.product-tile {
		margin: var(--product-tile-margin);
		height: 100%;

		:global(.wave) {
			position: absolute;
			top: 0;
			left: 0;
			width: 200%;
			animation: wave linear 3s infinite;
			transform: translateZ(0);
			will-change: transform;

			@media (prefers-reduced-motion: no-preference) {
				animation-play-state: var(--animps, running);
			}
		}
	}

	.product-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		border-radius: inherit;
	}

	.product {
		&-name {
			text-align: center;
			padding: 0.5em 1em 0 0.5em;
			span,
			a {
				display: -webkit-box;
				text-overflow: ellipsis;
				hyphens: auto;
				height: calc(2 * var(--h2-font-size));

				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}

		&-desc {
			height: 100%;
			padding: 0 1em;
			display: flex;
			align-content: center;
			margin: 0.4em 0;
			text-align: center;

			span {
				text-overflow: ellipsis;
				hyphens: auto;
				overflow: hidden;
				align-self: center;
				display: -webkit-box;
				-webkit-line-clamp: 5;
				-webkit-box-orient: vertical;
				min-height: 6em;
				flex: 1;
			}
		}
	}

	.actions {
		justify-self: flex-end;
		flex: 0 0 auto;
		align-self: center;
		text-align: center;
		position: relative;
		width: 100%;
		overflow: hidden;
		border-bottom-right-radius: inherit;
		border-bottom-left-radius: inherit;
	}

	.link {
		margin: 1em auto;
		padding: 0 0.5em;
	}

	.card-content {
		display: flex;
		text-align: center;
		height: 100%;
		overflow: hidden;
		flex-direction: column;
	}

	@media screen and (min-width: 420px) {
		.card-content {
			flex-direction: row;
		}

		.product-tile {
			:global(.s-card) {
				height: 100%;
			}
		}

		.text-container {
			flex: 1 0 auto;
			max-width: 100%;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}

		.actions {
			border-bottom-left-radius: 0;
			width: 115%;
			// flex: 1 1 calc(100% + 20px);
		}
	}

	@keyframes -global-wave {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(-50%);
		}
	}
</style>
