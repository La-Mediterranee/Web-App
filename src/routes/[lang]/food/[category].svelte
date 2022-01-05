<script context="module" lang="ts">
	export const prerender = true;

	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export function load({ params }: LoadInput): LoadOutput {
		return {
			props: {
				category: params.category,
			},
		};
	}
</script>

<script lang="ts">
	export let category: string;
</script>

<div>
	{category}
</div>

<style lang="scss">
	/* your styles go here */
</style>
