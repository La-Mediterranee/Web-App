<script context="module" lang="ts">
	import { baseLocale, locales } from '$i18n/i18n-util';
	import { replaceLocaleInUrl } from '$lib/utils';
	import { initI18n } from '$i18n/i18n-svelte';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { Locales } from '$i18n/i18n-types';

	export async function load({ page, session }: LoadInput): Promise<LoadOutput> {
		const lang = page.params.lang as Locales;

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
		// 		// redirect: replaceLocaleInUrl(page.path, baseLocale),
		// 		redirect: '/',
		// 	};
		// }

		// redirect to base locale if language is not present
		if (!locales.includes(lang)) {
			return {
				status: 302,
				redirect: replaceLocaleInUrl(page.path, baseLocale),
			};
		}

		// load dictionary data
		await initI18n(lang);

		return {
			props: {
				lang: session.locale,
			},
		};
	}
</script>

<script>
	import Providers from './_layoutProviders.svelte';
	import metatags from '$lib/stores/metatags';
	export let lang: Locales;
</script>

<svelte:window
	on:sveltekit:navigation-start={() => {
		console.log('Navigation started!');
		metatags.reset();
	}}
/>

<svelte:head>
	<html {lang} />
</svelte:head>

<Providers>
	<slot />
</Providers>
