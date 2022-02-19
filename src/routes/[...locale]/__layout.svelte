<script context="module" lang="ts">
	import { baseLocale } from '$i18n/i18n-util';
	import { RTL_LANGS, locales } from '$i18n/utils';
	import { browser, dev } from '$app/env';
	import { onMount } from 'svelte';

	import { setLocale } from '$i18n/i18n-svelte';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { replaceLocaleInUrl } from '$lib/utils';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	import type { Locales } from '$i18n/i18n-types';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ params, session, url }: LoadInput): Promise<LoadOutput> {
		const locale = params.locale as Locales;

		if (params.locale?.split('/')?.length > 1) {
			return {
				status: 404,
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
		if ((locale as string) !== '/' && (locale as string) !== '' && !locales.has(locale)) {
			return {
				status: 302,
				redirect: replaceLocaleInUrl(url.pathname, ''),
				// redirect: '/',
			};
		}

		// load dictionary data
		await loadLocaleAsync(session.locale);

		return {
			props: {
				lang: session.locale,
				dir: RTL_LANGS.has(locale) ? 'rtl' : 'ltr',
			},
		};
	}
</script>

<script lang="ts">
	// import { metatags } from '$lib/stores/metatags';
	import rtl from '$stores/rtl';
	import t from '$i18n/i18n-svelte';
	import metatags from '$lib/stores/seo/metatags';

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Tabbar from '$lib/components/Tabbar';
	import Statusbar from '$lib/components/Statusbar';

	import Modals from '../_Dialogs.svelte';

	export let dir: 'rtl' | 'ltr' | 'auto';
	export let lang: Locales;

	setLocale(lang);

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
