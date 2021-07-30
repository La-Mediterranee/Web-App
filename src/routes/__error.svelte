<script context="module" lang="ts">
	import type { HttpStatusCode } from 'types/index';

	interface Props {
		error: Error;
		status: HttpStatusCode;
	}

	export function load({ error, status }: Props): { props: Props } {
		return {
			props: {
				error,
				status
			}
		};
	}
</script>

<script lang="ts">
	import { dev } from '$app/env';

	export let status: HttpStatusCode;
	export let error: Error;
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
	<title>{status}</title>
</svelte:head>

<div>
	<h1>{status}</h1>
	<p>
		{#if status === 404}
			Die gesuchte Seite existiert leider nicht
		{:else if status === 500}
			Es gab einen Fehler auf unserem Server
		{:else}
			{error.message}
		{/if}
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

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
