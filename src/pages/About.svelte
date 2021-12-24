<script context="module" lang="ts">
	import { browser, dev } from '$app/env';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
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

	const metaData = {
		title: 'About | Sveltekit',
		description: 'About page of Sveltekit starter project',
		url: '/about',
		keywords: ['sveltekit', 'sveltekit starter', 'sveltekit starter about'],
		searchUrl: '/about',
	};
</script>

<h2>LA-Mediterranee</h2>

<style>
	/* your styles go here */
</style>
