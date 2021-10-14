<script lang="ts">
	import { page } from '$app/stores';

	import type { NavItem } from 'types/index';

	export let routes: NavItem[];

	let activeRoute = $page.path;
</script>

<nav id="nav" role="navigation">
	<ul id="navbar">
		{#each routes as { text, icon, href } (href)}
			<li class="nav-item" class:active={activeRoute === href} on:click={() => (activeRoute = href)}>
				<a {href}>
					<div class:active={activeRoute === href}>
						<svelte:component this={icon} width={30} height={30} />
					</div>
				</a>
				{#if activeRoute === href}
					<span>
						{text}
					</span>
				{/if}
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	a {
		color: inherit;
		text-decoration: none;
	}

	nav {
		// background: linear-gradient(to right, #4050e0e5, #062ba5);
		box-shadow: 0 2px 20px 0 var(--subtle);
		background: var(--theme-app-bar);
		position: fixed;
		z-index: 10;
		height: 4em;
		width: 100%;
		bottom: 0;
	}

	#navbar {
		height: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.nav-item {
		list-style: none;
		position: relative;
		transform: translateY(0);
		transition: transform 0.3s;
		height: 4em;
		width: 4em;

		a {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		div {
			height: fit-content;
			// width: 30px;
			// height: 30px;
		}

		span {
			font-size: 14px;
		}
	}

	li.active {
		transform: translateY(-30%);
	}

	div {
		&.active {
			// padding: 1em;
			margin-bottom: 0.4em;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 50%;
		}
	}

	.titleContainer {
		top: 0;
		left: 0;
		right: 0;
		flex: 1;
		position: absolute;
		justify-content: center;
		align-items: center;
	}
</style>
