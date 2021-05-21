<script lang="ts">
	import { navItems } from '$utils/data/navItems';
</script>

<div id="nav">
	<nav role="navigation">
		<ul class="navbar">
			{#each navItems as { text, icon }}
				<li class="nav-item">
					<a href={`#${text}`}>
						<div>
							<svelte:component this={icon} width={30} height={30} />
						</div>
						<span>
							{text}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<style lang="scss">
	a {
		color: inherit;
		text-decoration: none;
	}

	#nav {
		box-shadow: 0 2px 20px 0 var(--subtle);
	}

	nav {
		// background: linear-gradient(to right, #4050e0e5, #062ba5);
		background: var(--theme-app-bar);
		position: fixed;
		z-index: 3;
		height: 65px;
		bottom: 0;
		left: 0;
		right: 0;

		@media screen and (min-width: 770px) {
			position: sticky;
			height: 50px;
			top: 0;
		}
	}

	.navbar {
		display: flex;
		justify-content: space-around;
		height: 100%;
		padding: 0 10px;
		align-items: center;
	}

	.nav-item {
		list-style: none;

		a {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		div {
			height: fit-content;
			width: 30px;
			height: 30px;
		}

		span {
			font-size: 14px;
		}

		@media screen and (min-width: 770px) {
			a {
				align-items: center;
				flex-direction: row;
			}

			span {
				margin-left: 5px;
			}
		}
	}
</style>
