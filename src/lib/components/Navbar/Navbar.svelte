<script lang="ts">
	import { page } from '$app/stores';

	import Magnify from '$lib/Icons/filled/Magnify.svelte';
	import type { NavItem } from 'types/index';

	export let routes: NavItem[] = [];

	$: fixed = $page.path === '/';
</script>

<nav role="navigation" class:fixed={fixed === true}>
	<div id="nav-logo">
		<img src="/Logos/V1_210.webp" alt="" />
	</div>

	<div class="nav-content">
		<ul>
			{#each routes as { text, icon, href, rel } (href)}
				<li class="nav-item">
					<a
						{href}
						rel={`${rel instanceof Array ? rel.join(' ') : rel}`}
					>
						<div>
							<svelte:component
								this={icon}
								width={30}
								height={30}
							/>
						</div>
						<span>
							{text}
						</span>
					</a>
				</li>
			{/each}
		</ul>

		<form>
			<div>
				<input type="text" />
				<button aria-label="Suchen">
					<Magnify color="#fff" />
				</button>
			</div>
		</form>

		<div id="profile">
			<img src="" alt="" />
		</div>
	</div>
</nav>

<style lang="scss">
	// box-shadow: 0 2px 20px 0 var(--subtle);
	@use "./variables.scss" as *;

	$text-color: var(--tint-color);
	$bg-color: #000;

	a {
		color: inherit;
		text-decoration: none;
	}

	.fixed {
		position: fixed;
	}

	nav {
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

	.nav-content {
		display: flex;
		width: 88%;
	}

	ul {
		width: 80%;
		height: 100%;
		padding: 0.5em;
		display: none;
		justify-content: space-around;
		align-items: center;

		@media screen and (min-width: $md) {
			display: flex;
		}
	}

	.nav-item {
		list-style: none;

		a {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
		}

		div {
			display: block;
			height: fit-content;
			width: 30px;
			height: 30px;
		}

		span {
			font-size: 14px;
			margin-left: 5px;
		}
	}

	form {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		justify-self: flex-start;

		div {
			height: 2.5em;
			padding: 0.5em 0.7em;
			border-radius: 1.3em;
			width: 90%;
			background: $bg-color;
			align-items: center;
		}

		@media screen and (min-width: $md) {
			width: 20%;
		}
	}

	input {
		display: flex;
		align-content: center;
		align-items: center;
		color: $text-color;
		height: 100%;
		width: calc(100% - 30px);
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 30px;
	}

	#profile {
		width: 65px;
		height: 100%;
		display: flex;
		align-items: center;
		margin-right: 0.5em;

		img {
			width: 100%;
			height: 50px;
		}
	}
</style>
