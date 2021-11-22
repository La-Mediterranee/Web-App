<script context="module" lang="ts">
	// import type { HttpStatusCode } from 'types/index';

	type HttpStatusCode = number;

	interface Props {
		error: Error;
		status: HttpStatusCode;
	}

	const errorMessages: {
		[status: HttpStatusCode]: string;
	} = {
		404: 'Die gesuchte Seite existiert leider nicht',
		500: 'Es gab einen Fehler auf unserem Server',
	};

	export function load({ error, status }: Props) {
		return {
			props: {
				status,
				message: errorMessages[status] || error.message,
				error,
			},
		};
	}
</script>

<script lang="ts">
	import { dev } from '$app/env';

	export let status: HttpStatusCode;
	export let message: string;
	export let error: Error;
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
	<title>{status}</title>
</svelte:head>

<div>
	<h1>{status}</h1>
	<p>
		{message}
	</p>
</div>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}

<style>
	div {
		display: block;
		text-align: center;
		place-items: center;
		padding-top: 4em;
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
