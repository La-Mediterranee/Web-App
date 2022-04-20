<script context="module" lang="ts">
	import { browser, dev } from '$app/env';

	import About from '$pages/About.svelte';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;
	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;
	export const prerender = true;
</script>

<script lang="ts">
	export let aboutData: any;
</script>

<About {aboutData} />
