<!-- <svelte:options immutable={true} /> -->
<script context="module" lang="ts">
	import type { LocalizedString } from 'typesafe-i18n';
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';
	import Ripple from 'svelty-material/actions/Ripple';

	import { cart } from '$lib/stores/cart';
	import { getAppContext } from '$lib/stores/app';

	import type { TabbarItem } from '.';

	export let routes: TabbarItem[];
	export let paths: Record<string, () => LocalizedString>;

	const app = getAppContext();
</script>

<nav itemscope itemtype="https://schema.org/SiteNavigationElement">
	{#each routes as { pathLabel, icon, href, size, rel, isActive, route } (href)}
		<!-- on:click={() => (activeRoute = href)} -->
		<a
			{href}
			{rel}
			class="item"
			class:active={isActive}
			title={paths[pathLabel]()}
			on:click={() => app.setActiveRoute(route)}
		>
			<div class="item-container" use:Ripple>
				<div class="bubble" />
				<div class="mini-bubble" />
				<div class="image">
					<Icon
						path={icon}
						ariaHidden={true}
						size={size?.width || 30}
						width={size ? size.width : 30}
						height={size ? size.height : 30}
					/>
					{#if href.includes('cart')}
						<span class="cart-badge">{$cart.cart.totalQuantity}</span>
					{/if}
					<!-- color={activeRoute !== href
					? 'var(--tint-color)'
					: 'var(--bar-color)'} -->
				</div>
			</div>
			<div class="title-container">
				{#if isActive}
					<span style="color: var(--tint-color);">
						{paths[pathLabel]()}
					</span>
				{/if}
			</div>
		</a>
	{/each}
</nav>

<style lang="scss">
	@use 'variables' as *;

	* {
		--bar-color: var(--body-bg2);
		display: flex;
	}

	// .item-mask {
	// 	color: var(--bar-color);
	// 	position: absolute;
	// 	height: 100%;
	// 	right: 0px;
	// 	left: -16px;
	// 	bottom: 0;
	// 	top: 0;
	// }

	nav {
		display: flex;
		height: 60px;
		width: 100%;
		bottom: 0;
		z-index: 10;
		background: var(--bar-color);
		position: fixed;
		align-items: center;
		justify-content: space-around;

		@media (min-width: map-get($map: $breakpoints, $key: md)) {
			display: none;
		}
	}

	.item-container {
		height: 100%;
		width: 100%;
		position: relative;
		justify-content: center;
		align-items: center;
	}

	.bubble,
	.mini-bubble {
		border-radius: 50%;
		position: absolute;
		align-self: center;
		background: var(--bar-color);
	}

	.cart-badge {
		position: absolute;
		top: 3.5px;
		left: 2px;
		font-size: 1em;
		font-weight: bold;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		color: var(--accent-color);

		.active & {
			color: black;
		}
	}

	.bubble {
		height: 15px;
		width: 15px;
	}

	.mini-bubble {
		// width: 22px;
		// height: 22px;
		width: 30px;
		height: 30px;
	}

	.title-container {
		flex: 1;
		position: relative;
		justify-content: center;
		align-items: center;
		text-align: center;
		white-space: nowrap;
		font-size: 0.75rem;

		@media screen and (min-width: 350px) {
			font-size: 0.95rem;
		}
	}

	.image {
		justify-content: center;
		position: relative;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.item {
		display: block;
		text-decoration: none;
		position: relative;
		background: var(--bar-color);
		width: 54px;
		height: 54px;

		// height: 100%;
		border-radius: 50%;

		transition-property: transform;
		transition-timing-function: ease-in-out, cubic-bezier(0.64, 0.57, 0.67, 1.53);
		transition-duration: 0.2s;

		&-container {
			border-radius: inherit;
		}

		.bubble,
		&.active {
			transform: translateY(-50%);
			transition-delay: 0.15s;

			.mini-bubble {
				animation-name: animatedMiniBubbleIn;
				animation-duration: 0.7s;
				animation-delay: 0.3s;
				animation-iteration-count: 1;
				animation-fill-mode: forwards;
				background: var(--tint-color);
			}

			.bubble {
				animation-name: animatedBubbleIn;
				animation-duration: 0.8s;
				animation-iteration-count: 1;
				animation-timing-function: ease-in-out;
				animation-fill-mode: forwards;
				background: var(--tint-color);
			}
		}
	}

	@keyframes animatedBubbleIn {
		0% {
			transform: scale(0.01);
		}
		20% {
			transform: scale(3);
		}
		40% {
			transform: scale(1.65);
		}
		60% {
			transform: scale(1.65);
		}
		80% {
			transform: scale(3.2);
		}
		100% {
			transform: scale(3);
		}
	}

	@keyframes animatedBubbleOut {
		0% {
			transform: scale(3);
		}
		20% {
			transform: scale(3.2);
		}
		40% {
			transform: scale(1.65);
		}
		60% {
			transform: scale(1.65);
		}
		80% {
			transform: scale(3);
		}
		100% {
			transform: scale(0.01);
		}
	}

	@keyframes animatedMiniBubbleIn {
		0% {
			opacity: 0;
			transform: translateY(13px);
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes animatedImageIn {
		0% {
			color: var(--bar-color);
		}
		100% {
			color: var(--tint-color);
		}
	}
</style>
