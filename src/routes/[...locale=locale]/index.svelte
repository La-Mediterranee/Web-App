<script context="module" lang="ts">
	import type { HomepageProps } from '../api/homepage';
	import type { LoadEvent } from '@sveltejs/kit/types';

	export async function load({ fetch }: LoadEvent) {
		const url = `/api/homepage`;
		const homePageData: HomepageProps = await fetch(url)
			.then(p => p.json())
			.catch(error => console.error(error));

		return {
			props: { homePageData },
			stuff: {
				activeRoute: 'home',
			},
		};
	}
</script>

<script lang="ts">
	import Homepage from '$pages/Homepage.svelte';

	export let homePageData: HomepageProps | undefined;
</script>

<Homepage {homePageData} />
