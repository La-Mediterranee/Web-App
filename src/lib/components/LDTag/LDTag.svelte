<script lang="ts">
	import { browser } from '$app/env';
	import { serializeSchema } from '../../utils/json-ld';

	import type { Schema } from 'types/utils/json-ld';

	export let schema: Schema;
</script>

<!-- <svelte:head>
	{@html serializeSchema(schema, 'restaurant-seo-schema')}
</svelte:head> -->
{@html serializeSchema(schema, 'restaurant-seo-schema')}

<!-- {@html serializeSchema(schema, 'breadcrumbs-seo-schema')} -->
<!-- {@html serializeSchema(schema, 'product-seo-schema')} -->
