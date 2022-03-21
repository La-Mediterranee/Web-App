<script lang="ts">
	import Link from 'svelty-material/components/Button/Link.svelte';

	import type { NavItem } from 'types/navbar';

	export let href: NavItem['href'];
	export let rel: string | undefined;
	export let current: string | boolean;
</script>

<li class="nav-item">
	<Link
		text
		{href}
		{rel}
		{...{
			'aria-current': current,
		}}
		on:click
	>
		<!-- <div>
				<Icon path={icon} size={size?.width || 30} />
			</div> -->
		<!-- color={'var(--tint-color, #fff)'} -->
		<span class="label">
			<slot />
		</span>
	</Link>
</li>

<style lang="scss">
	.nav-item {
		list-style: none;

		div {
			height: fit-content;
			width: 27px;
			height: 30px;
		}

		.label {
			font-size: 1.3em;
		}
	}
</style>
