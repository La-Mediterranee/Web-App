<script context="module" lang="ts">
	import { mdiCart } from '@mdi/js';
	import { page, session } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import type { INavbarItem } from 'types/navbar';
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Link from 'svelty-material/components/Button/Link.svelte';
	import Badge from 'svelty-material/components/Badge/Badge.svelte';

	import LL from '$i18n/i18n-svelte';
	import NavLogo from './NavLogo.svelte';
	import SkipMain from './SkipMain.svelte';
	import NavbarItem from './NavbarItem.svelte';

	import { cart } from '$lib/stores/cart';

	export let routes: INavbarItem[] = [];

	const dispatch = createEventDispatcher();
</script>

<header id="top-bar" itemscope itemtype="https://schema.org/WPHeader">
	<SkipMain>Skip to main</SkipMain>
	<NavLogo href={`${$session.urlLocale || '/'}`} on:click={() => dispatch('click', 'home')}>
		Home
	</NavLogo>

	<nav
		itemscope
		itemtype="https://schema.org/SiteNavigationElement"
		aria-label={`${$LL.nav.navbarAriaLabel()}`}
	>
		<ul>
			{#each routes as { pathLabel, href, rel, route } (href)}
				<NavbarItem
					{href}
					{rel}
					current={href === $page.url.pathname && 'page'}
					on:click={() => dispatch('click', route)}
				>
					{$LL.nav.routes[pathLabel]()}
				</NavbarItem>
			{/each}
		</ul>
	</nav>

	<div id="avatar">
		{#if $session.user}
			<Link
				text
				size="x-large"
				class="img-url"
				aria-label="Account {$session.user.displayName}"
				href={`${$session.urlLocale}/customer`}
				on:click={() => dispatch('click', 'customer')}
			>
				<img
					src={$session.user.photoURL ||
						`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' /%3E`}
					alt="Your Avatar"
					aria-hidden="true"
					loading="eager"
					width={48}
					height={48}
					referrerpolicy="no-referrer"
				/>
			</Link>
		{:else}
			<Link
				text
				sveltekit:prefetch
				href={`${$session.urlLocale}/customer/login`}
				on:click={() => dispatch('click', 'customer')}
			>
				<span>{$LL.customer.login()}</span>
			</Link>
		{/if}
	</div>
	<div class="cart">
		<Link
			style="width: 3.5em; height:3.5em"
			sveltekit:prefetch
			href={`${$session.urlLocale}/cart`}
			size="x-large"
			icon
			on:click={() => dispatch('click', 'cart')}
		>
			<Badge class="primary-color" bordered active={$cart.state !== 'Loading'}>
				<Icon path={mdiCart} ariaHidden={true} />

				<span class="visually-hidden">{$LL.cart.cart()}</span>
				<span slot="badge">
					{$cart.cart.totalQuantity}
				</span>
			</Badge>
		</Link>
	</div>
</header>

<style lang="scss">
	// box-shadow: 0 2px 20px 0 var(--subtle);
	@use 'variables' as *;

	#top-bar {
		// --text-color: var(--tint-color);
		--text-color: #fff;
		--bg-color: #000;
		// background: linear-gradient(to right, #4050e0e5, #062ba5);
		display: flex;
		top: 0;
		height: var(--top-bar-height, 72.5px);
		width: 100%;
		z-index: 10;
		padding: 0.3em 0.5em;
		position: var(--header-position, sticky);
		background: var(--theme-app-bar);
		border-radius: 0 0 1.2em 1.2em;

		@media screen and (min-width: map-get($map: $breakpoints, $key: sm)) {
			padding: 0.3em 0.5em;
		}
	}

	nav {
		flex: 0 1 88%;
		justify-content: flex-end;

		@media (min-width: map-get($map: $breakpoints, $key: md)) {
			justify-content: center;
		}
	}

	ul {
		width: 100%;
		height: 100%;
		padding: 0.5em;
		display: none;
		justify-content: flex-start;
		align-items: center;

		@media screen and (min-width: map-get($map: $breakpoints, $key: md)) {
			display: flex;
		}
	}

	#avatar {
		flex: 1 0 65px;
		height: 100%;
		display: flex;
		align-items: center;
		margin-right: 0.5em;
		border-radius: 0.3em;

		:global(.img-url) {
			padding: 0.3em;
			min-width: unset;
			height: 56px;
			border-radius: inherit;
		}

		img {
			border-radius: 0.3em;
		}
	}

	// @media (hover: hover) and (pointer: fine) {
	// 	#avatar:hover {
	// 	}
	// }

	.cart {
		--theme-cards: transparent;
		--s-badge-offset-x: 12px;
		--s-badge-offset-y: 11px;

		display: none;
		align-items: center;
		justify-content: center;
		padding: 0 0.6em 0 0;

		[dir='rtl'] & {
		}
	}

	@media screen and (min-width: 960px) {
		.cart {
			display: flex;
		}

		:global([dir='rtl']) {
			.cart :global(svg path) {
				transform-origin: 50% 50%;
				transform: scaleX(-1);
				// transform: scale(1, -1) translate(0, -100%);
			}
		}
	}
</style>
