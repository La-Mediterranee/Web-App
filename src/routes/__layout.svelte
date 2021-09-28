<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Statusbar from '$lib/components/Statusbar';
	import Tabbar from '$lib/components/Tabbar/Tabbar.svelte';
	import Installprompt from '$lib/components/Installprompt';

	import Modals from './_Modals.svelte';
	import Providers from './_layoutProviders.svelte';
	import { metatags } from '$lib/stores/metatags';

	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	let online: boolean = true;

	onMount(() => {
		window.dataLayer = window.dataLayer || [];

		function gtag(...args: unknown[]) {
			window.dataLayer.push(args as never);
		}

		gtag('js', new Date());
		gtag('config', 'GA_MEASUREMENT_ID');
	});
</script>

<svelte:window bind:online />

<!-- <LDTag {}/>  -->

<svelte:head>
	<title>{$metatags.title}</title>
	{#each Object.entries($metatags) as [property, content]}
		{#if content}
			{#if ['title', 'description', 'image'].includes(property)}
				<meta name={property} {content} />
			{:else}
				<meta {property} {content} />
			{/if}
		{/if}
	{/each}
</svelte:head>

<Providers>
	<Modals>
		<div id="mainContent">
			<Statusbar {online} />
			<Navbar routes={desktopNavItems} />
			<main>
				<Installprompt installSource={'LayoutInstallButton'} />
				<slot />
			</main>
			<Tabbar routes={mobileNavItems} />
			<Footer />
		</div>
	</Modals>
</Providers>

<style global>
	main {
		padding-top: 1.2em;
		min-height: 90vh;
		position: relative;
	}
</style>
