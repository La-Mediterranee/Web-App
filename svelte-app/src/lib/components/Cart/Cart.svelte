<script>
	import { cart } from '$lib/stores/cart';
	import CartItem from './CartItem.svelte';
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<h1>Warenkorb</h1>

<div id="cart">
	{#each $cart as item (item.name)}
		<CartItem {item} quantity={item.quantity} />
	{/each}
</div>

<style>
	/* your styles go here */
</style>
