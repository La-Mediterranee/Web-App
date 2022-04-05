<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';
	import Textarea from 'svelty-material/components/Textarea/Textarea.svelte';

	export let disabled: boolean = false;
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<div class="notes-container" class:disabled>
	<Textarea name="notes" class="cart-notes" rows={3} {disabled} noResize filled solo>
		<slot name="notes" />
	</Textarea>
</div>
<div class="actions">
	<div class="sum">
		<slot name="quantity" />
		<span style="flex: 1; text-align: end;">
			<slot />
		</span>
	</div>
	<div id="cart-checkout">
		<Button type="submit" class="form-elements-color" rounded {disabled}>
			<slot name="submit-text" />
		</Button>
	</div>
</div>

<style lang="scss">
	.notes-container {
		width: 100%;

		:global(.s-text-field__wrapper) {
			border-radius: 0.9em !important;

			:global(textarea.cart-notes) {
				width: 100%;
				min-height: 6em;
				padding: 1em 0 0 0;
			}
		}

		&.disabled {
			opacity: 0.4;
		}
	}

	// .cart-notes {
	// 	resize: none;
	// 	border: 2px solid var(--tint-color);
	// 	border-radius: 0.9em;
	// 	margin-top: 0.75em;
	// 	width: 100%;
	// 	min-height: 6em;
	// 	padding: 0.4em 0 0 0;
	// }

	.sum {
		display: flex;
		flex: 1 0 100%;
	}

	#cart-checkout {
		display: flex;
		justify-content: flex-end;
		margin-top: 1em;
		flex: 1;
		// margin-inline-start: 1em;
	}

	.actions {
		display: flex;
		margin-top: 0.6em;
		width: 100%;
		flex-wrap: wrap;
	}
</style>
