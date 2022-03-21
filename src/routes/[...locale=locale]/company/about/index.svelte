<script context="module" lang="ts">
	import { browser, dev } from '$app/env';

	import About from '$pages/About.svelte';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';
	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;
	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;
	export const prerender = true;

	async function load({ fetch }: LoadInput): Promise<LoadOutput> {
		const data = await fetch('/api/about').then(res => res.json());

		return {
			props: data,
		};
	}
</script>

<script lang="ts">
</script>

<About />
