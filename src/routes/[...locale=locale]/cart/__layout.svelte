<script context="module" lang="ts">
	import { browser } from '$app/env';

	import type { LoadOutput } from '@sveltejs/kit/types';

	const routeName = 'cart';

	export function load(): LoadOutput {
		return {
			stuff: {
				activeRoute: routeName,
			},
		};
	}
</script>

<!-- <svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head> -->

<slot />
