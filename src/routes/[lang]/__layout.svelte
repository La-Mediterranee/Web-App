<script context="module" lang="ts">
	import { dev } from '$app/env';
	import { onMount } from 'svelte';

	import { RTL_LANGS } from '$i18n/utils';
	import { baseLocale, locales } from '$i18n/i18n-util';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';
	import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { getGlobal, replaceLocaleInUrl } from '$lib/utils';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { Locales } from '$i18n/i18n-types';

	export async function load({ page, session }: LoadInput): Promise<LoadOutput> {
		const output: LoadOutput = {
			props: {
				rtl: RTL_LANGS.has(session.locale),
			},
		};

		return output;
	}
</script>

<script lang="ts">
	import Modals from './_Dialogs.svelte';

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Statusbar from '$lib/components/Statusbar';
	import Tabbar from '$lib/components/Tabbar';
	import Installprompt from '$lib/components/Prompts/Installprompt';

	import { metatags } from '$lib/stores/metatags';
	import UpdatePrompt from '$lib/components/Prompts/SericeWorker/UpdatePrompt.svelte';
	import LL from '$i18n/i18n-svelte';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher/LocaleSwitcher.svelte';

	export let rtl: boolean;

	let online: boolean = true;

	onMount(async () => {
		window.dataLayer = window.dataLayer || [];

		function gtag(...args: unknown[]) {
			window.dataLayer.push(args as never);
		}

		gtag('js', new Date());
		gtag('config', 'GA_MEASUREMENT_ID');

		if (!dev) {
			registerServiceWorker();
		}
	});
</script>

<svelte:window bind:online />

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

<!-- <Providers> -->
<Modals>
	<div id="mainContent">
		<Statusbar message={$LL.connectionStatus()} {online} />
		<Navbar routes={desktopNavItems} />
		<main>
			<Installprompt installSource={'LayoutInstallButton'} />
			<slot />
			<LocaleSwitcher />
			<UpdatePrompt />
		</main>
		<Tabbar routes={mobileNavItems} />
		<Footer />
	</div>
</Modals>
<!-- </Providers> -->
