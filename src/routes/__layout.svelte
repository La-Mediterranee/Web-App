<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { onMount } from 'svelte';

	import { RTL_LANGS } from '$i18n/utils';

	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';

	export async function load({ session, params, url }: LoadInput): Promise<LoadOutput> {
		return {
			props: {
				lang: session.locale,
				dir: RTL_LANGS.has(session.locale) ? 'rtl' : 'ltr',
			},
		};
	}
</script>

<script>
	import Providers from './_layoutProviders.svelte';

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

<Providers>
	<slot />
</Providers>

<style lang="scss" global>
	@import '../app.scss';

	#main-content {
		scroll-behavior: smooth;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.inner-content {
		display: grid;
		grid-template-columns: 100%;
	}

	main {
		flex: 1;
	}
</style>
