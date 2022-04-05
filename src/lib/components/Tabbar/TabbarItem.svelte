<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Ripple from 'svelty-material/actions/Ripple';

	import type { ITabbarItem } from 'types/navbar';

	export let title: string;
	export let icon: ITabbarItem['icon'];
	export let href: ITabbarItem['href'];
	export let size: ITabbarItem['size'];
	export let rel: ITabbarItem['rel'];
	export let isActive: ITabbarItem['isActive'];
</script>

<a {href} {rel} class="item" class:active={isActive} {title} on:click>
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
				<span class="cart-badge">
					<slot name="cart-badge" />
				</span>
			{/if}
			<!-- color={activeRoute !== href
		? 'var(--tint-color)'
		: 'var(--bar-color)'} -->
		</div>
	</div>
	<div class="title-container">
		{#if isActive}
			<span style="color: var(--tint-color);">
				<slot />
			</span>
		{/if}
	</div>
</a>

<style lang="scss">
	@use 'variables' as *;

	div {
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

	.item {
		display: block;
		text-decoration: none;
		position: relative;
		background: var(--bar-color);
		width: 54px;
		height: 54px;

		border-radius: 50%;

		transition-property: transform;
		transition-timing-function: ease-in-out, cubic-bezier(0.64, 0.57, 0.67, 1.53);
		transition-duration: 0.2s;

		&-container {
			border-radius: inherit;
		}

		&:focus-visible {
			outline: none;
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

	.item-container {
		height: 100%;
		width: 100%;
		position: relative;
		justify-content: center;
		align-items: center;

		&::before {
			border-radius: inherit;
			bottom: 0;
			color: inherit;
			content: '';
			left: 0;
			opacity: 0;
			pointer-events: none;
			position: absolute;
			right: 0;
			top: 0;
			transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
			background-color: currentColor;
			z-index: 1;

			.item:focus-visible & {
				opacity: var(--s-btn-focus-visible-opacity, 0.24);
			}
		}
	}

	.bubble,
	.mini-bubble {
		border-radius: 50%;
		position: absolute;
		align-self: center;
		background: var(--bar-color);
		transform: translateZ(0);
	}

	.cart-badge {
		position: absolute;
		top: 4px;
		left: 1.6px;
		font-size: 1em;
		font-weight: bold;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		color: var(--accent-color);

		.active & {
			color: #ad6000;
		}
	}

	.bubble {
		height: 15px;
		width: 15px;
	}

	.mini-bubble {
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
</style>
