<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { onMount } from 'svelte';

	import { RTL_LANGS } from '$i18n/utils';
	import { initI18n } from '$i18n/i18n-svelte';
	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	import type { Locales } from '$i18n/i18n-types';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ params, session, stuff, url }: LoadInput): Promise<LoadOutput> {
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
		if (!locales.includes(lang)) {
			return {
				status: 302,
				redirect: replaceLocaleInUrl(url.pathname, baseLocale),
			};
		}

		// stuff.lang = session.locale;
		stuff.locale = lang;

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
	import MaterialApp from 'svelty-material/components/MaterialApp/MaterialAppMin.svelte';

	import Modals from './_Dialogs.svelte';
	import Providers from './_layoutProviders.svelte';

	import t from '$i18n/i18n-svelte';
	import rtl from '$stores/rtl';
	import metatags from '$lib/stores/seo/metatags';

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Tabbar from '$lib/components/Tabbar';
	import Statusbar from '$lib/components/Statusbar';
	// import Installprompt from '$lib/pwa/components/Prompts/Installprompt/Installprompt.svelte';
	// import UpdatePrompt from '$lib/pwa/components/Prompts/SericeWorker/UpdatePrompt.svelte';

	import { replaceLocaleInUrl } from '$lib/utils';
	import { baseLocale, locales } from '$i18n/i18n-util';

	export let dir: 'rtl' | 'ltr' | 'auto';
	export let lang: Locales;

	$rtl = dir === 'rtl';

	let online: boolean = true;

	$: if (
		browser &&
		(document.defaultView || window).innerWidth > document.documentElement.clientWidth
	) {
		document.body.classList.add('has-scrollbar');
	}

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
	<MaterialApp theme="custom">
		<Modals>
			<div id="main-content">
				<Statusbar message={$t.connectionStatus()} {online} />
				<Navbar locale={lang} routes={desktopNavItems} />
				<div class="inner-content">
					<main>
						<!-- <Installprompt installSource={'LayoutInstallButton'} /> -->
						<slot />
						<!-- <UpdatePrompt /> -->
					</main>
					<Footer />
				</div>
				<Tabbar locale={lang} routes={mobileNavItems} />
			</div>
		</Modals>
	</MaterialApp>
</Providers>

<style lang="scss" global>
	@import '../app.scss';

	#main-content {
		scroll-behavior: smooth;
	}
</style>
