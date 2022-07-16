<!-- <svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head> -->
<script context="module" lang="ts">
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import { geti18nContext } from '$i18n/utils';

	import type { LoadEvent } from '@sveltejs/kit/types';

	export async function load({ session }: LoadEvent) {
		await loadNamespaceAsync(session.locale, 'checkout');

		return {
			props: {
				locale: session.locale,
			},
		};
	}
</script>

<script lang="ts">
	const { setLocale } = geti18nContext();

	export let locale: Locales;

	setLocale(locale);
</script>

<slot />
