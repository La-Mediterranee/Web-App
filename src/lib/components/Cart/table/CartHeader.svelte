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
		padding: 8px;
		padding-top: 12px;
		padding-bottom: 12px;
		text-align: center;
		color: var(--cart-table-color);
	}

	th {
		text-transform: capitalize;
	}
</style>
