<script context="module" lang="ts">
	import { page } from '$app/stores';
	import { getAuthContext } from '$lib/firebase/helpers';

	import type { NavItem } from 'types/index';
</script>

<script lang="ts">
	import Icon from 'svelte-material-components/src/components/Icon/Icon.svelte';
	import Image from '../Image/Image.svelte';

	export let routes: NavItem[] = [];

	const user = getAuthContext();

	$: fixed = $page.path === '/';
</script>

<header class:fixed>
	<div id="nav-logo">
		<img src="/Logos/V1_210.webp" alt="" />
	</div>

	<nav aria-label="desktop primary">
		<ul>
			{#each routes as { text, icon, href, rel } (href)}
				<li class="nav-item">
					<a
						{href}
						rel={`${rel instanceof Array ? rel.join(' ') : rel}`}
					>
						<div>
							<Icon path={icon} width={30} height={30} />
							<!-- color={'var(--tint-color, #fff)'} -->
						</div>
						<span>
							{text}
						</span>
					</a>
				</li>
			{/each}
		</ul>
		<!-- <div class="nav-content">
		</div> -->
	</nav>

	<!-- <form role="search">
	<div>
		<input type="search" aria-label="essen oder getränke" size="20" />
		<button aria-label="suchen">
			<Icon path={magnify} color="#fff" />
		</button>
	</div>
	</form> -->

	<div id="profile">
		<Image
			src={$user?.photoURL ||
				`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' /%3E`}
			alt=""
			loading="eager"
			width={50}
			height={50}
		/>
	</div>
</header>

<style lang="scss">
	// box-shadow: 0 2px 20px 0 var(--subtle);
	@use "./variables.scss" as *;

	// $text-color: var(--tint-color);
	$text-color: #fff;
	$bg-color: #000;

	a {
		color: inherit;
		text-decoration: none;
	}

	.fixed {
		position: fixed;
	}

	// nav,
	header {
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

		@media screen and (min-width: $sm) {
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

	// .nav-content,
	nav {
		width: 88%;
		justify-content: flex-end;

		@media (min-width: $md) {
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

		@media screen and (min-width: $md) {
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
			display: block;
			height: fit-content;
			width: 27px;
			height: 30px;
		}

		span {
			font-size: 14px;
			// margin-left: 5px;
		}
	}

	// form {
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// 	height: 100%;
	// 	width: 100%;
	// 	justify-self: flex-start;

	// 	div {
	// 		height: 2.5em;
	// 		padding: 0.5em 0.7em;
	// 		border-radius: 1.3em;
	// 		width: 90%;
	// 		// background: $bg-color;
	// 		background: var(--tint-color);
	// 		align-items: center;
	// 	}

	// 	@media screen and (min-width: $md) {
	// 		width: 20%;
	// 	}
	// }

	// input {
	// 	display: flex;
	// 	align-content: center;
	// 	align-items: center;
	// 	color: $text-color;
	// 	height: 100%;
	// 	width: calc(100% - 30px);
	// }

	// button {
	// 	display: flex;
	// 	justify-content: center;
	// 	align-items: center;
	// 	width: 30px;
	// 	height: 30px;
	// }

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
