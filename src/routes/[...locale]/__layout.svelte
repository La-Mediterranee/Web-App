<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/env';

	import { baseLocale } from '$i18n/i18n-util';
	import { setLocale } from '$i18n/i18n-svelte';
	import { RTL_LANGS, locales } from '$i18n/utils';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { mobileNavItems, desktopNavItems } from '$utils/navItems';

	import type { Locales } from '$i18n/i18n-types';
	import type { TabbarItem } from '$lib/components/Tabbar/Tabbar.svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';

	export async function load({ params, session, url }: LoadInput): Promise<LoadOutput> {
		const locale = params.locale as Locales;

		if (params.locale?.split('/')?.length > 1) {
			return {
				status: 404,
			};
		}

		// redirect to preferred language if user comes from page root
		if (locale !== session.locale && session.locale !== baseLocale) {
			const path = `${session.urlLocale}` + url.pathname; //replaceLocaleInUrl(, );
			const redirect = new URL(path, url.origin);

			return {
				status: 302,
				redirect: path,
			};
		}

		// redirect to base locale if language is not present
		// (locale as string) !== '/' &&
		if ((locale as string) !== '' && !locales.has(locale)) {
			// const path = replaceLocaleInUrl(url.pathname, '');
			const path = `${session.urlLocale}` + url.pathname;
			const redirect = new URL(path, url.origin);

			return {
				status: 302,
				redirect: path,
				// redirect: '/',
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

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Tabbar from '$lib/components/Tabbar';
	import Statusbar from '$lib/components/Statusbar';

	import Modals from '../_Dialogs.svelte';

	import { page } from '$app/stores';

	export let lang: Locales;
	export let urlLocale: Locales | '';
	export let dir: 'rtl' | 'ltr' | 'auto';

	let online: boolean = true;

	setLocale(lang);

	$: tabbarRoutes = <TabbarItem[]>mobileNavItems.map(({ href, icon, pathLabel, rel, size }) => {
		return {
			href: `${urlLocale}${href.replace(/\/$/, '')}`,
			rel: rel instanceof Array ? rel.join(' ') : rel,
			icon,
			pathLabel,
			size,
			isActive: href === $page.stuff.activeRoute,
			// isActive: (href === $activeRoute()),
		};
	});

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
		<Statusbar message={$t.connectionStatus()} {online} />
		<Navbar locale={urlLocale} routes={desktopNavItems} />
		<!-- <Installprompt installSource={'LayoutInstallButton'} /> -->
		<div class="inner-content">
			<main class="margin-navbar">
				<slot />
			</main>
			<Footer />
		</div>
		<!-- <UpdatePrompt /> -->
		<Tabbar paths={$t.nav.routes} routes={tabbarRoutes} />
	</div>
</Modals>
