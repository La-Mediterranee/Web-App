<!-- <svelte:options immutable={true} /> -->
<script context="module" lang="ts">
	import type { NavItem } from 'types/index';
	import type { LocalizedString } from 'typesafe-i18n';

	export interface TabbarItem extends Omit<NavItem, 'rel'> {
		isActive: boolean;
		rel: string | undefined;
	}
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	export let routes: TabbarItem[];
	export let paths: Record<string, () => LocalizedString>;
</script>

<nav itemscope itemtype="https://schema.org/SiteNavigationElement">
	{#each routes as { pathLabel, icon, href, size, rel, isActive } (href)}
		<!-- on:click={() => (activeRoute = href)} -->
		<a {href} {rel} class="item" class:active={isActive} title={paths[pathLabel]()}>
			<div class="item-container">
				<div class="bubble" />
				<div class="mini-bubble" />
				<div class="image">
					<Icon
						path={icon}
						size={size?.width || 30}
						width={size ? size.width : 30}
						height={size ? size.height : 30}
					/>
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

	// .item-mask {
	// 	color: var(--bar-color);
	// 	position: absolute;
	// 	height: 100%;
	// 	right: 0px;
	// 	left: -16px;
	// 	bottom: 0;
	// 	top: 0;
	// }

	.bubble {
		position: absolute;
		align-self: center;
		height: 14px;
		width: 14px;
		background: var(--bar-color);
		border-radius: 50%;
	}

	.mini-bubble {
		position: absolute;
		align-self: center;
		// width: 22px;
		// height: 22px;
		width: 28px;
		height: 28px;
		background: var(--bar-color);
		border-radius: 50%;
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
		width: 50px;
		height: 50px;

		// height: 100%;
		border-radius: 50%;

		&.active {
			transform: translateY(-50%);
			transition-property: transform;
			transition-timing-function: ease-in-out, cubic-bezier(0.64, 0.57, 0.67, 1.53);
			transition-delay: 0.3s;
			transition-duration: 0.2s;

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
