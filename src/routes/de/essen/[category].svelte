<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export function load({ page }: LoadInput): LoadOutput {
		return {
			props: {
				category: page.params.category,
			},
		};
	}
</script>

<script lang="ts">
	export let category: string;
	console.log(category);
</script>

<!-- <style>
	/* your styles go here */
</style> -->
