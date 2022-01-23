<script context="module" lang="ts">
	import type { Locales } from '$i18n/i18n-types';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ session }: LoadInput): Promise<LoadOutput> {
		const output: LoadOutput = {
			props: {},
		};

		return output;
	}
</script>

<script lang="ts">
	// import { metatags } from '$lib/stores/metatags';
</script>

<!-- <LDTag {}/>  -->

<!-- <svelte:head>
	{#each headLinks as { href, rel, ...rest }}
		<link {rel} {href} {...rest} />
	{/each}

	<title>{$metatags.title}</title>
	{#each Object.entries($metatags) as [property, content]}
		{#if content}
			{#if ['title', 'description', 'image', 'google-site-verification', 'referrer'].includes(property)}
				<meta name={property} content={content?.toString()} />
			{:else}
				<meta {property} {content} />
			{/if}
		{/if}
	{/each}
</svelte:head> -->

<slot />
