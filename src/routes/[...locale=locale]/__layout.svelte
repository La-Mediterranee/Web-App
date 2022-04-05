<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { createEventDispatcher, onMount } from 'svelte';

	import { baseLocale } from '$i18n/i18n-util';
	import { setLocale } from '$i18n/i18n-svelte';
	import { RTL_LANGS, locales, seti18nContext } from '$i18n/utils';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';
	import type { Locales, Translations, TranslationFunctions, Formatters } from '$i18n/i18n-types';

	export async function load({ params, session, url }: LoadInput): Promise<LoadOutput> {
		const locale = params.locale as Locales | '';

		// redirect to preferred language if user comes from page root
		if (locale !== session.locale && session.locale !== baseLocale) {
			const path = replaceLocaleInUrl(url.pathname, `${session.urlLocale}`); //+ url.pathname; replaceLocaleInUrl(, );
			console.log('first');

			return {
				status: 302,
				redirect: path,
			};
		}

		// (locale as string) !== '/' &&
		if (locale !== '' && !locales.has(locale as Locales)) {
			const path = replaceLocaleInUrl(url.pathname, `${session.urlLocale}`);
			console.log('second');

			return {
				status: 302,
				redirect: path,
			};
		}

		if (session.locale === 'de' && locale !== '') {
			const path = replaceLocaleInUrl(url.pathname, '');
			console.log('third');

			return {
				status: 302,
				redirect: path,
			};
		}

		// load dictionary data
		await loadLocaleAsync(session.locale);

		return {
			props: {
				lang: session.locale,
				urlLocale: session.urlLocale,
				dir: RTL_LANGS.has(locale) ? 'rtl' : 'ltr',
			},
		};
	}
</script>

<script lang="ts">
	// import { metatags } from '$lib/stores/metatags';
	import t from '$i18n/i18n-svelte';

	import Modals from '../_Dialogs.svelte';
	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Statusbar from '$lib/components/Statusbar';
	import Tabbar from '$lib/components/Tabbar';

	// import { initI18nSvelte } from 'typesafe-i18n/adapters/adapter-svelte';
	// import { loadedLocales, loadedFormatters } from '$i18n/i18n-util';
	import { navigating, page, session } from '$app/stores';

	import { cart } from '$lib/stores/cart';
	import { setAppContext } from '$lib/stores/app';
	import { replaceLocaleInUrl } from '$lib/utils';

	import type { INavbarItem, ITabbarItem } from 'types/navbar';

	export let lang: Locales;
	export let urlLocale: Locales | '';
	export let dir: 'rtl' | 'ltr' | 'auto';

	let online: boolean = true;

	const { LL, setLocale: setLL } = seti18nContext();

	setLocale(lang);
	setLL(lang);

	const app = setAppContext();
	app.setActiveRoute($page.stuff.activeRoute);

	const navbarRoutes = <INavbarItem[]>desktopNavItems.map(item => {
		const { href, rel } = item;
		return Object.assign({}, item, {
			href: `${urlLocale}${href}`,
			rel: rel instanceof Array ? rel.join(' ') : rel,
		});
	});

	$: tabbarRoutes = <ITabbarItem[]>mobileNavItems.map(item => {
		const { href, rel, route } = item;
		return Object.assign({}, item, {
			href: `${urlLocale}${href}`,
			rel: rel instanceof Array ? rel.join(' ') : rel,
			isActive: route === $app.activeRoute,
		});
	});

	onMount(() => {
		if (dev) return;
		// const sw = await registerServiceWorker();
		// Notification.requestPermission(permission => {
		// 	if (permission === 'granted') {
		// 		sw?.showNotification($LL.addToCart());
		// 	}
		// });

		return () => {};
	});
</script>

<svelte:window bind:online />

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
		<Statusbar {online}>
			{$LL.connectionStatus()}
		</Statusbar>
		<!-- {#if $navigating}
			<PreloadingIndicator />
		{/if} -->
		<!-- <Installprompt installSource={'LayoutInstallButton'} /> -->
		<Navbar
			routes={navbarRoutes}
			LL={$LL}
			user={$session.user}
			urlLocale={$session.urlLocale}
			pathname={$page.url.pathname}
			cartState={$cart.state}
			on:click={e => app.setActiveRoute(e.detail)}
		>
			<svelte:fragment slot="cartTotalQuantity">
				{$cart.totalQuantity}
			</svelte:fragment>
		</Navbar>

		<!-- It's important to have the tabbar at the beginning for better a11y -->
		<Tabbar
			paths={$LL.nav.routes}
			routes={tabbarRoutes}
			on:click={e => app.setActiveRoute(e.detail)}
		>
			{$cart.totalQuantity}
		</Tabbar>
		<div class="inner-content">
			<main id="main-start" class="margin-navbar">
				<slot />
			</main>
			<Footer />
		</div>
		<!-- <UpdatePrompt /> -->
	</div>
</Modals>
