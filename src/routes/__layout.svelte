<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { onMount } from 'svelte';

	import { initI18n } from '$i18n/i18n-svelte';
	import { baseLocale } from '$i18n/i18n-util';
	import { RTL_LANGS, locales } from '$i18n/utils';

	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { replaceLocaleInUrl } from '$lib/utils';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	import type { Locales } from '$i18n/i18n-types';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ params, session, url }: LoadInput): Promise<LoadOutput> {
		const locale = params.locale as Locales;

		console.log(`\nlocale: ${JSON.stringify(params)}`);
		// console.log(params.locale?.split('/')?.length > 1);

		if (params.locale?.split('/').length > 1) {
			return {
				status: 400,
			};
		}

		// redirect to preferred language if user comes from page root
		if (locale !== session.locale && session.locale !== baseLocale) {
			return {
				status: 302,
				redirect: `/${session.locale}`,
			};
		}

		// redirect to base locale if language is not present
		// for trailing slash add: (locale as string) !== '/' &&
		if ((locale as string) !== '' && !locales.has(locale)) {
			return {
				status: 302,
				redirect: replaceLocaleInUrl(url.pathname, ''),
			};
		}

		// load dictionary data
		await initI18n(session.locale);

		return {
			props: {
				lang: session.locale,
				dir: RTL_LANGS.has(locale) ? 'rtl' : 'ltr',
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

<!-- <svelte:head>
	<html {lang} {dir} />
</svelte:head> -->

<Providers>
	<MaterialApp theme="custom">
		<!-- <slot /> -->
		<Modals>
			<div id="main-content">
				<Statusbar message={$t.connectionStatus()} {online} />
				<Navbar locale={lang} routes={desktopNavItems} />
				<!-- <Installprompt installSource={'LayoutInstallButton'} /> -->
				<div class="inner-content">
					<main>
						<slot />
					</main>
					<Footer />
				</div>
				<!-- <UpdatePrompt /> -->
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
