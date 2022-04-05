<!-- <svelte:options immutable={true} /> -->
<script context="module" lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { LocalizedString } from 'typesafe-i18n';
	import type { ITabbarItem } from 'types/navbar';
</script>

<script lang="ts">
	import TabbarItemComponent from './TabbarItem.svelte';

	export let routes: ITabbarItem[];
	export let paths: Record<string, () => LocalizedString>;

	const dispatch = createEventDispatcher();
</script>

<nav itemscope itemtype="https://schema.org/SiteNavigationElement">
	{#each routes as { pathLabel, icon, href, size, rel, isActive, route } (href)}
		<TabbarItemComponent
			{icon}
			{href}
			{size}
			{rel}
			{isActive}
			title={paths[pathLabel]()}
			on:click={() => dispatch('click', route)}
		>
			<svelte:fragment slot="cart-badge">
				<slot />
			</svelte:fragment>

			{paths[pathLabel]()}
		</TabbarItemComponent>
	{/each}
</nav>

<style lang="scss">
	@use 'variables' as *;

	nav {
		--bar-color: var(--body-bg2);

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
</style>
