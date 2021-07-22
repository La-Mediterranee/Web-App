<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Statusbar from '$lib/components/Statusbar';
	import Tabbar from '$lib/components/Tabbar/Tabbar.svelte';
	import Installprompt from '$lib/components/Installprompt';
	import Providers from './_layoutProviders.svelte';

	import { navItems } from '$utils/navItems';
	import LDTag from '$lib/components/LDTag';

	let online: boolean = true;
	let mobile: boolean = true;

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

<!-- <LDTag {}/> -->

<Providers>
	<Statusbar {online} />
	<Navbar routes={navItems} />
	<main>
		<Installprompt installSource={'LayoutInstallButton'} />
		<slot />
	</main>
	{#if mobile}
		<Tabbar routes={navItems} />
	{/if}
	<Footer />
</Providers>

<style>
	main {
		padding-top: 50px;
		min-height: 90vh;
		position: relative;
	}
</style>
