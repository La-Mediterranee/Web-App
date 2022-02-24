<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { onMount } from 'svelte';

	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { RTL_LANGS, locales } from '$i18n/utils';

	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { replaceLocaleInUrl } from '$lib/utils';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	import type { Locales } from '$i18n/i18n-types';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ session, params, url }: LoadInput): Promise<LoadOutput> {
		return {
			props: {
				lang: session.locale,
				dir: RTL_LANGS.has(session.locale) ? 'rtl' : 'ltr',
			},
		};
	}
</script>

<script>
	import MaterialApp from 'svelty-material/components/MaterialApp/MaterialAppMin.svelte';

	import Modals from './_Dialogs.svelte';
	import Providers from './_layoutProviders.svelte';

	// import t from '$i18n/i18n-svelte';
	// import rtl from '$stores/rtl';
	// import metatags from '$lib/stores/seo/metatags';

	// import LDTag from '$lib/components/LDTag';
	// import Navbar from '$lib/components/Navbar';
	// import Footer from '$lib/components/Footer';
	// import Tabbar from '$lib/components/Tabbar';
	// import Statusbar from '$lib/components/Statusbar';
	// import Installprompt from '$lib/pwa/components/Prompts/Installprompt/Installprompt.svelte';
	// import UpdatePrompt from '$lib/pwa/components/Prompts/SericeWorker/UpdatePrompt.svelte';

	// export let dir: 'rtl' | 'ltr' | 'auto';
	// export let lang: Locales;

	// setLocale(lang);

	// $rtl = dir === 'rtl';

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

<!-- <svelte:head>
	<html {lang} {dir} />
</svelte:head> -->

<Providers>
	<MaterialApp theme="custom">
		<slot />
	</MaterialApp>
</Providers>

<style lang="scss" global>
	@import '../app.scss';

	#main-content {
		scroll-behavior: smooth;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.inner-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		flex: 1;
	}

	main {
		flex: 1;
	}
</style>
