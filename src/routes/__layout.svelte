<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { onMount } from 'svelte';
	import { RTL_LANGS, seti18nContext } from '$i18n/utils';

	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import type { LoadEvent, LoadOutput } from '@sveltejs/kit/types';

	export async function load({ session, params, url }: LoadEvent): Promise<LoadOutput> {
		return {
			props: {
				lang: session.locale,
				dir: RTL_LANGS.has(session.locale) ? 'rtl' : 'ltr',
			},
		};
	}
</script>

<script lang="ts">
	import Providers from './_layoutProviders.svelte';

	seti18nContext();

	$: if (
		browser &&
		(document.defaultView || window).innerWidth > document.documentElement.clientWidth
	) {
		document.body.classList.add('has-scrollbar');
	}

	onMount(() => {
		if (dev) return;

		// const sw = await registerServiceWorker();
		// Notification.requestPermission(permission => {
		// 	if (permission === 'granted') {
		// 		sw?.showNotification($LL.addToCart());
		// 	}
		// });
	});
</script>

<Providers>
	<!-- <slot /> -->
</Providers>

<style lang="scss" global>
	@import '../app.scss';

	#main-content {
		scroll-behavior: smooth;
		min-height: 100vh;
	}

	.inner-content {
		display: grid;
		grid-template-columns: 100%;
		min-height: calc(100vh - var(--top-bar-height, 72.5px));
	}
</style>
