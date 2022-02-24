<script context="module" lang="ts">
	import type { LoadOutput } from '@sveltejs/kit';

	const routeName = '/cart';

	export function load(): LoadOutput {
		return {
			stuff: {
				activeRoute: routeName,
			},
		};
	}
</script>

<script>
	import { activeRoute } from '$lib/stores/activeRoute';

	activeRoute.setRoute(routeName);
</script>

<slot />
