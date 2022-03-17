<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import { trash } from '$lib/Icons/filled';
</script>

<td role="cell" class="cart-item item-action">
	<Button icon on:click aria-label="Produkt vom Warenkorb entfernen">
		<Icon path={trash} ariaHidden={true} />
		<span class="visually-hidden">
			<slot />
		</span>
	</Button>
</td>

<style lang="scss">
	.item-action {
		flex: 0 1 var(--cart-item-actions-width);
	}
</style>
