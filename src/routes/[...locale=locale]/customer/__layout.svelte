<script context="module" lang="ts">
	import type { LoadOutput } from '@sveltejs/kit/types/internal';

	const routeName = 'customer';

	export function load(): LoadOutput {
		return {
			stuff: {
				activeRoute: routeName,
			},
		};
	}
</script>

<slot />
