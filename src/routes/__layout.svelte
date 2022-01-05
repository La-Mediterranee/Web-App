<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { initI18n } from '$i18n/i18n-svelte';
	import { browser, dev } from '$app/env';

	import { RTL_LANGS } from '$i18n/utils';
	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { Locales } from '$i18n/i18n-types';

	export async function load({
		params,
		session,
		stuff,
	}: LoadInput): Promise<LoadOutput> {
		const lang = params.lang as Locales;
		// const lang = page.path.split('/')[1] as Locales | undefined;

		// if (page.path.includes('api')) {
		// 	return {
		// 		props: {
		// 			lang: session.locale,
		// 		},
		// 	};
		// }

		// redirect to preferred language if user comes from page root
		if (!lang) {
			return {
				status: 302,
				redirect: `/${session.locale}`,
			};
		}

		// if (lang !== session.locale) {
		// 	return {
		// 		status: 302,
		// 		redirect: replaceLocaleInUrl(page.path, baseLocale),
		// 	};
		// }

		// redirect to base locale if language is not present
		// if (!locales.includes(lang)) {
		// 	stuff.lang = session.locale;
		// 	return {
		// 		status: 302,
		// 		redirect: replaceLocaleInUrl(page.path, baseLocale),
		// 	};
		// }

		// load dictionary data
		await initI18n(lang);

		return {
			props: {
				lang: lang,
				dir: RTL_LANGS.has(lang) ? 'rtl' : 'ltr',
			},
		};
	}
</script>

<script>
	import LL from '$i18n/i18n-svelte';
	import Modals from './_Dialogs.svelte';
	import Providers from './_layoutProviders.svelte';

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Statusbar from '$lib/components/Statusbar';
	import Tabbar from '$lib/components/Tabbar';
	import Installprompt from '$lib/pwa/components/Prompts/Installprompt/Installprompt.svelte';
	import UpdatePrompt from '$lib/pwa/components/Prompts/SericeWorker/UpdatePrompt.svelte';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher/LocaleSwitcher.svelte';

	import rtl, { rtl2 } from '$stores/rtl';
	import metatags from '$lib/stores/metatags';

	import t from '$i18n/i18n-svelte';

	export let dir: 'rtl' | 'ltr' | 'auto';
	export let lang: Locales;

	$rtl = dir === 'rtl';

	let online: boolean = true;

	onMount(async () => {
		if (dev) return;

		// const sw = await registerServiceWorker();
		// Notification.requestPermission(permission => {
		// 	if (permission === 'granted') {
		// 		sw?.showNotification($LL.addToCart());
		// 	}
		// });
	});
</script>

<svelte:window
	bind:online
	on:sveltekit:navigation-start={() => {
		console.log('Navigation started!');
		metatags.reset();
	}}
/>

<svelte:head>
	<html {lang} {dir} />
</svelte:head>

<Providers>
	<Modals>
		<div id="mainContent">
			<Statusbar message={$t.connectionStatus()} {online} />
			<Navbar locale={lang} routes={desktopNavItems} />
			<main>
				<Installprompt installSource={'LayoutInstallButton'} />
				<slot />
				<UpdatePrompt />
			</main>
			<Tabbar locale={lang} routes={mobileNavItems} />
			<Footer />
		</div>
	</Modals>
</Providers>
