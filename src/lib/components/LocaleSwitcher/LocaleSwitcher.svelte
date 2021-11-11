<script lang="ts">
	import { page } from '$app/stores';
	import { replaceLocaleInUrl } from '$lib/utils';
	import { setLocale, locale } from '$i18n/i18n-svelte';
	import { locales } from '$i18n/i18n-util';

	import type { Locales } from '$i18n/i18n-types';

	const switchLocale = async (locale: Locales) => {
		// update store => loads new dictionary from server
		await setLocale(locale);
		// update url to refelct locale changes
		history.pushState({ locale }, '', replaceLocaleInUrl(location.pathname, locale));
	};

	// update locale when page store changes
	$: setLocale($page.params.lang as Locales);

	// update locale when navigating via browser back/formward buttons
	const handlePopStateEvent = async ({ state }: PopStateEvent) => state.locale && (await setLocale(state.locale));
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<ul>
	{#each locales as l}
		<li role="button" class:active={l === $locale} on:click={() => switchLocale(l)}>
			{l}
		</li>
	{/each}
</ul>
