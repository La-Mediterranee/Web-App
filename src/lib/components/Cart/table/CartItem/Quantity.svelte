<script lang="ts">
	import Input from 'svelty-material/components/Input/Input.svelte';

	import type { CartItem } from 'types/product';

	export let ID: CartItem['ID'];
	export let quantity: number;
</script>

<td role="cell" class="cart-item item-quantity">
	<Input>
		<input
			id="quantity-{ID}"
			min="1"
			max="10"
			name="quantity"
			pattern="[0-9]*"
			type="number"
			inputmode="numeric"
			required
			on:change
			bind:value={quantity}
		/>
	</Input>
</td>

<style lang="scss">
	.item-quantity {
		flex: 0 0 var(--cart-item-quantity-width);
		max-width: 4em;

		:global(.s-input__slot) {
			margin: 0;
		}

		input {
			flex: 1 0 30%;
			padding: 0.2em;
			width: 3em;
			border-radius: 5px;
			border: 1px solid var(--cart-table-color);
			text-align: center;
			color: inherit;

			&:out-of-range {
				border: 2px var(--error-color-border-color) solid;
			}
		}
	}

	@media screen and (min-width: 320px) {
		.item-quantity {
			max-width: unset;
		}
	}
</style>
