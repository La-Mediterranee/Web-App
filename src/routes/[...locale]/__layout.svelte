<script context="module" lang="ts">
	import { initI18n } from '$i18n/i18n-svelte';
	import { baseLocale } from '$i18n/i18n-util';
	import { RTL_LANGS, locales } from '$i18n/utils';

	// import { registerServiceWorker } from '$lib/pwa/register-sw';
	import { replaceLocaleInUrl } from '$lib/utils';

	import type { Locales } from '$i18n/i18n-types';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	// export async function load({ params, session, url }: LoadInput): Promise<LoadOutput> {
	// 	const locale = params.locale as Locales;

	// 	console.log(`\nlocale: ${JSON.stringify(params)}`);
	// 	// console.log(params.locale?.split('/')?.length > 1);

	// 	if (params.locale?.split('/')?.length > 1) {
	// 		return {
	// 			status: 400,
	// 		};
	// 	}

	// 	// redirect to preferred language if user comes from page root
	// 	if (locale !== session.locale && session.locale !== baseLocale) {
	// 		return {
	// 			status: 302,
	// 			redirect: `/${session.locale}`,
	// 		};
	// 	}

	// 	// redirect to base locale if language is not present
	// 	if ((locale as string) !== '/' && (locale as string) !== '' && !locales.has(locale)) {
	// 		return {
	// 			status: 302,
	// 			redirect: replaceLocaleInUrl(url.pathname, ''),
	// 			// redirect: '/',
	// 		};
	// 	}

	// 	// load dictionary data
	// 	await initI18n(session.locale);

	// 	return {
	// 		props: {
	// 			lang: session.locale,
	// 			dir: RTL_LANGS.has(locale) ? 'rtl' : 'ltr',
	// 		},
	// 	};
	// }
	export async function load({ session }: LoadInput): Promise<LoadOutput> {
		const output: LoadOutput = {
			props: {},
		};

		return output;
	}
</script>

<script lang="ts">
	// import { metatags } from '$lib/stores/metatags';
</script>

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

<slot />
