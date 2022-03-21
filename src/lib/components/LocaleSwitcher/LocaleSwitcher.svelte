<script lang="ts">
	import { page } from '$app/stores';

	import { locales } from '$i18n/i18n-util';
	import { setLocale, locale } from '$i18n/i18n-svelte';
	import { loadLocaleAsync } from '$i18n/i18n-util.async';

	import { serialize } from '$lib/server/cookie';
	import { replaceLocaleInUrl, setCookie } from '$lib/utils';

	import type { Locales } from '$i18n/i18n-types';

	const switchLocale = async (locale: Locales) => {
		// update store => loads new dictionary from server
		const cookie = serialize('pref-locale', locale, {
			path: '/',
			secure: true,
			sameSite: 'none',
		});

		await loadLocaleAsync(locale);

		setCookie(cookie);
		setLocale(locale);
		// update url to refelct locale changes
		history.pushState({ locale }, '', replaceLocaleInUrl(location.pathname, locale));
	};

	// update locale when page store changes
	$: setLocale($page.params.lang as Locales);

	// update locale when navigating via browser back/formward buttons
	const handlePopStateEvent = async ({ state }: PopStateEvent) =>
		state.locale && setLocale(state.locale);
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<ul>
	{#each locales as l}
		<li role="button" class:active={l === $locale} on:click={() => switchLocale(l)}>
			{l}
		</li>
	{/each}
</ul>
