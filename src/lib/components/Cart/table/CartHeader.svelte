<script context="module" lang="ts">
	export interface TableHeader {
		header: string;
		className?: string;
		headerClass?: string;
	}
</script>

<script lang="ts">
	export let headers: TableHeader[];
</script>

{#each headers as { header, className, headerClass }}
	<th role="columnheader" scope="col" class={headerClass}>
		<span class={className}>
			{header}
		</span>
	</th>
{/each}

<style lang="scss">
	th {
		padding: 0.7em 0.2em;
		text-align: center;
		color: var(--cart-table-color);
	}

	th {
		text-transform: capitalize;
	}
</style>
