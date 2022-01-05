<script context="module" lang="ts">
	import { homepageLoader } from '$loaders';

	import type { HomepageProps } from '../api/homepage';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load({ fetch }: LoadInput) {
		return homepageLoader(fetch);
	}
</script>

<script lang="ts">
	import Homepage from '$pages/Homepage.svelte';

	export let homePageData: HomepageProps | undefined;
</script>

<Homepage {homePageData} />
