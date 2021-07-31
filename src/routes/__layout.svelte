<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Statusbar from '$lib/components/Statusbar';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import Tabbar from '$lib/components/Tabbar/Tabbar.svelte';
	import Installprompt from '$lib/components/Installprompt';
	import Providers from './_layoutProviders.svelte';

	import { mediQueries } from '$lib/utils/constants';
	import { navItems } from '$utils/navItems';

	let online: boolean = true;
	let mobile: boolean = true;

	onMount(() => {
		window.dataLayer = window.dataLayer || [];

		function gtag(...args: unknown[]) {
			window.dataLayer.push(args as never);
		}

		gtag('js', new Date());
		gtag('config', 'GA_MEASUREMENT_ID');

		const mq = window.matchMedia(`(min-width: ${mediQueries.md})`);

		mq.addEventListener('change', (e) => {
			if (e.matches) {
				mobile = false;
				return;
			}

			mobile = true;
		});
	});
</script>

<svelte:window bind:online />

<!-- <LDTag {}/> -->

<Providers>
	<div id="mainContent">
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
	</div>
	<Modal />
</Providers>

<style>
	main {
		padding-top: 1.2em;
		min-height: 90vh;
		position: relative;
	}
</style>
