<script context="module" lang="ts">
	import type { LoadOutput } from '@sveltejs/kit/types/internal';
	import { getContext } from 'svelte';

	const routeName = '/drinks';

	export async function load(): Promise<LoadOutput> {
		return {
			stuff: {
				activeRoute: routeName,
			},
		};
	}
</script>

<script lang="ts">
	const app = getContext('App');
</script>

<slot />
