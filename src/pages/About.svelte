
<script lang="ts">
	import LDTag from '$lib/components/LDTag';

	import type { WithContext, AboutPage } from 'schema-dts';
	
	export let aboutData: any;

	const ldJSON: WithContext<AboutPage> = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
	};

	const metaData = {
		title: 'About | Sveltekit',
		description: 'About page of Sveltekit starter project',
		url: '/about',
		keywords: ['sveltekit', 'sveltekit starter', 'sveltekit starter about'],
		searchUrl: '/about',
	};
</script>

<LDTag schema={ldJSON} />

<h2>LA-Mediterranee</h2>

<style>
	/* your styles go here */
</style>
