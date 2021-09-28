<script lang="ts">
	import { serializeSchema } from '../../utils/json-ld';

	import type { Schema } from 'types/utils/json-ld';
	import { browser } from '$app/env';

	export let schema: Schema;
</script>

<svelte:head>
	{#if !browser}
		{@html serializeSchema(schema)}
	{/if}
</svelte:head>
