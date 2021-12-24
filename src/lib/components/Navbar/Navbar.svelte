<script context="module" lang="ts">
	import { page } from '$app/stores';
	import { getAuthContext } from '$lib/firebase/helpers';

	import type { NavItem } from 'types/index';
	import type { LocalizedString } from 'typesafe-i18n';
</script>

<script lang="ts">
	import Icon from 'svelte-material-components/src/components/Icon/Icon.svelte';
	import t from '$i18n/i18n-svelte';

	export let routes: NavItem[] = [];

	$: paths = $t.nav.desktop.routes as Record<string, () => LocalizedString>;

	const user = getAuthContext();
</script>

<header>
	<div id="nav-logo">
		<a href="/">
			<img src="/Logos/V1_210.webp" alt="" />
		</a>
	</div>

	<nav aria-label={`${$t.nav.desktop.arialabel()}`}>
		<ul>
			{#each routes as { pathLabel, icon, href, rel } (href)}
				<li class="nav-item">
					<a
						{href}
						rel={`${rel instanceof Array ? rel.join(' ') : rel}`}
						{...{
							'aria-current': href === $page.path && 'page',
						}}
					>
						<div>
							<Icon path={icon} width={30} height={30} />
							<!-- color={'var(--tint-color, #fff)'} -->
						</div>
						<span>
							{paths[pathLabel]()}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div id="profile">
		{#if $user}
			<img
				src={$user?.photoURL ||
					`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' /%3E`}
				alt=""
				loading="eager"
				width={50}
				height={50}
			/>
		{:else}
			<a href="/customer/login">{$t.login()}</a>
		{/if}
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
	header {
		// --text-color: var(--tint-color);
		--text-color: #fff;
		--bg-color: #000;
		// background: linear-gradient(to right, #4050e0e5, #062ba5);
		display: flex;
		top: 0;
		height: 72.5px;
		width: 100%;
		z-index: 10;
		padding: 0.3em 0;
		position: sticky;
		background: var(--theme-app-bar);
		border-radius: 0 0 1.2em 1.2em;

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
		// margin-right: 0.75rem;
		+ .nav-item {
			margin-left: 1.15rem;
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

		span {
			font-size: 1.2em;
			// margin-left: 5px;
		}
	}

	#profile {
		width: 65px;
		height: 100%;
		display: flex;
		align-items: center;
		margin-right: 0.5em;

		// :global(img) {
		// 	// width: 100%;
		// 	width: 50px;
		// 	height: 50px;
		// }
	}

	@media (hover: hover) and (pointer: fine) {
		#profile:hover {
		}
	}
</style>
