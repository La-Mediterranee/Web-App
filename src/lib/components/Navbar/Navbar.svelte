<script context="module" lang="ts">
	import { mdiCart } from '@mdi/js';
	import { page, session } from '$app/stores';

	import type { NavItem } from 'types/index';
	import type { LocalizedString } from 'typesafe-i18n';
</script>

<script lang="ts">
	import t from '$i18n/i18n-svelte';
	import Icon from 'svelty-material/components/Icon/Icon.svelte';

	export let routes: NavItem[] = [];
	export let locale: string = 'en';

	const _routes = routes.map(({ href, icon, pathLabel, rel, size }) => {
		return {
			href: `/${locale}${href}`, //.replace(/\/$/, '')
			rel: rel instanceof Array ? rel.join(' ') : rel,
			icon,
			pathLabel,
			size,
		};
	});

	$: paths = $t.nav.routes as Record<string, () => LocalizedString>;
</script>

<header id="top-bar">
	<div id="nav-logo">
		<a href={`${$session.urlLocale || '/'}`}>
			<img src="/Logos/V1_210.webp" aria-hidden="true" alt="" />
			<span class="visually-hidden">Home</span>
		</a>
	</div>

	<nav aria-label={`${$t.nav.navbarAriaLabel()}`}>
		<ul>
			{#each _routes as { pathLabel, icon, href, rel, size } (href)}
				<li class="nav-item">
					<a
						{href}
						{rel}
						{...{
							'aria-current': href === $page.url.pathname && 'page',
						}}
					>
						<!-- <div>
							<Icon path={icon} size={size?.width || 30} />
						</div> -->
						<!-- color={'var(--tint-color, #fff)'} -->
						<span class="label">
							{paths[pathLabel]()}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div id="profile">
		{#if $session.user}
			<a href={`${$session.urlLocale}/customer`}>
				<img
					src={$session.user.photoURL ||
						`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' /%3E`}
					alt="Your Avatar"
					loading="eager"
					width={50}
					height={50}
					referrerpolicy="no-referrer"
				/>
			</a>
		{:else}
			<a href={`${$session.urlLocale}/customer/login`}>{$t.customer.login()}</a>
		{/if}
	</div>
	<div class="cart">
		<a href={`${$session.urlLocale}/cart`} sveltekit:prefetch>
			<Icon path={mdiCart} />
			<span class="visually-hidden">{$t.cart.cart()}</span>
		</a>
	</div>
</header>

<style lang="scss">
	// box-shadow: 0 2px 20px 0 var(--subtle);
	@use 'variables' as *;

	a {
		color: inherit;
		text-decoration: none;
	}

	// nav,
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

		:global(.has-scrollbar.no-scroll) & {
			width: calc(100% - 17px);
		}

		@media screen and (min-width: map-get($map: $breakpoints, $key: sm)) {
			padding: 0.3em 0.5em;
		}
	}

	div {
		display: flex;
		justify-content: center;
	}

	#nav-logo {
		display: flex;
		width: 6.7em;
		height: 3.8em;

		img {
			width: 6.7em;
			height: 100%;
		}
	}

	nav {
		width: 88%;
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

	.nav-item {
		list-style: none;

		&:not(:last-child) {
			margin-right: 1.15rem;
		}

		a {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
		}

		div {
			height: fit-content;
			width: 27px;
			height: 30px;
		}

		.label {
			font-size: 1.2em;
			margin-inline-start: 0.2em;
		}
	}

	#profile {
		width: 65px;
		height: 100%;
		display: flex;
		align-items: center;
		margin-right: 0.5em;
	}

	@media (hover: hover) and (pointer: fine) {
		#profile:hover {
		}
	}

	.cart {
		display: none;
	}

	@media screen and (min-width: 960px) {
		.cart {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 1em;
		}

		:global([dir='rtl']) {
			.nav-item {
				margin-right: 0;

				&:not(:last-child) {
					margin-left: 1.15rem;
				}
			}

			.cart :global(svg path) {
				transform-origin: 50% 50%;
				// transform: scale(1, -1) translate(0, -100%);
				transform: scaleX(-1);
			}
		}
	}
</style>
