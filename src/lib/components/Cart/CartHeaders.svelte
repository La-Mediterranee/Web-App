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

<!-- svelte-ignore a11y-no-redundant-roles -->
<thead role="rowgroup">
	<tr role="row">
		{#each headers as { header, className, headerClass }}
			<th role="columnheader" scope="col" class={headerClass}>
				<span class={className}>
					{header}
				</span>
			</th>
		{/each}
	</tr>
</thead>

<style lang="scss">
	thead,
	tr {
		display: flex;
	}

	thead {
		display: flex;
		flex-direction: column;
		position: sticky;
		width: 100%;
		z-index: 1;
		border-radius: 1em;
		top: calc(var(--top-bar-height) + 10px);
		background-color: var(--theme-primary-color);
	}

	@media screen and (min-width: 960px) {
		thead {
			display: flex;
			position: sticky;
			width: 100%;
			top: calc(var(--top-bar-height) + 10px);
			left: 0;
		}
	}

	th {
		padding: 0.7em 0.2em;
		text-align: center;
		color: var(--cart-table-color);
	}

	th {
		text-transform: capitalize;
	}
</style>
