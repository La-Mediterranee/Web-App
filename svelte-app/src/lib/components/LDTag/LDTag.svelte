<script lang="ts">
	import { serializeSchema } from '../../utils/json-ld';

	import type { Schema } from 'types/utils/json-ld';

	export let schema: Schema;
</script>

<svelte:head>
	{@html serializeSchema(schema)}
</svelte:head>
