<script context="module" lang="ts">
	import type { HomepageProps } from '../api/homepage';
	import type { LoadInput } from '@sveltejs/kit/types/internal';

	export async function load({ fetch }: LoadInput) {
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
	import { getContext } from 'svelte';

	export let homePageData: HomepageProps | undefined;
</script>

<Homepage {homePageData} />
