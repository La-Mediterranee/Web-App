<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';

	export let totalQuantity: number;
	export let totalAmount: string;
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<div class="notes-container">
	<div>
		<label>
			Anmerkungen:
			<textarea name="notes" class="cart-notes" placeholder="Anmerkungen: " />
		</label>
	</div>
</div>
<div class="actions">
	<div class="sum">
		<span style="display: flex; height: 100%; align-items: center;">
			Summe ({totalQuantity} Produkte): {totalAmount}
		</span>
	</div>
	<div id="cart-checkout">
		<Button type="submit" class="form-elements-color" disabled={!totalQuantity} rounded>
			Zur Kasse
		</Button>
	</div>
</div>

<style lang="scss">
	.notes-container {
		width: 100%;
	}

	.cart-notes {
		resize: none;
		border: 2px solid var(--tint-color);
		width: 100%;
		min-height: 6em;
		border-radius: 0.9em;
		padding: 0.8em;
		margin-top: 0.75em;
		color: white;
	}

	.sum {
		flex: 1;
	}

	#cart-checkout {
		display: flex;
		justify-content: flex-end;
		margin-inline-start: 1em;
	}

	.actions {
		display: flex;
		margin-top: 0.6em;
		width: 100%;
	}
</style>
