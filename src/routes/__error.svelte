<script context="module" lang="ts">
	// import type { HttpStatusCode } from 'types/index';
	import type { LoadEvent } from '@sveltejs/kit/types';

	// type HttpStatusCode = number;

	// interface Props {
	// 	error: Error;
	// 	status: HttpStatusCode;
	// }

	// const errorMessages: {
	// 	[status: HttpStatusCode]: string;
	// } = {
	// 	404: 'Die gesuchte Seite existiert leider nicht',
	// 	500: 'Es gab einen Fehler auf unserem Server',
	// };

	export async function load({ error, status, session }: LoadEvent) {
		await loadNamespaceAsync(session.locale, 'errors');

		return {
			props: {
				status,
				error,
			},
		};
	}
</script>

<script lang="ts">
	import Link from 'svelty-material/components/Button/Link.svelte';

	import type { NamespaceErrorsTranslation } from '$i18n/i18n-types';

	import { dev } from '$app/env';

	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import { session } from '$app/stores';
	import { LL, setLocale } from '$i18n/utils';

	export let status: keyof NamespaceErrorsTranslation;
	export let error: Error;

	setLocale($session.locale);
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
	<title>{status}</title>
</svelte:head>

<div>
	<h1>{status}</h1>
	<p>
		{$LL.errors[status]() || $LL.errors['404']()}
	</p>
	<Link href="/">back to La-Mediterrane</Link>

	{#if dev && error.stack}
		<pre>{error.stack}</pre>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 4em;
		min-height: 100vh;
	}

	h1,
	p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0.25em 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	pre {
		padding: 2em;
		word-wrap: break-word;
		white-space: pre-wrap; /* css-3 */
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
