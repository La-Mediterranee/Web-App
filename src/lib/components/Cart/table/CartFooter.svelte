<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';

	export let headersLength: number;
	export let totalQuantity: number;
	export let totalAmount: string;
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<tr role="row">
	<td id="notes-container" role="cell" colspan={headersLength}>
		<div>
			<label for="notes">Anmerkungen: </label>
			<textarea name="notes" id="notes" placeholder="Anmerkungen: " />
		</div>
	</td>
</tr>
<tr>
	<td role="cell" class="sum" colspan={headersLength - 2} aria-colspan={headersLength - 2}>
		<span style="display: flex; height: 100%; align-items: center;">
			Summe ({totalQuantity} Produkte): {totalAmount}
		</span>
	</td>
	<td role="cell" colspan="2">
		<Button type="submit" class="form-elements-color" disabled={!totalQuantity} rounded>
			Zur Kasse
		</Button>
	</td>
</tr>

<style lang="scss">
	tr {
		color: var(--cart-table-color);
		text-align: center;
		width: 100%;
	}

	div {
		text-align: left;
	}

	td {
		padding: 1em;
		text-align: right;
	}

	#notes-container {
		width: 100%;
	}

	#notes {
		display: block;
		resize: none;
		border: 2px solid var(--tint-color);
		width: 100%;
		min-height: 6em;
		border-radius: 0.9em;
		padding: 0.8em;
		margin-top: 0.75em;
	}
</style>
