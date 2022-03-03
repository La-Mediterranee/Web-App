<script context="module" lang="ts">
	// export async function load() {
	// 	return {};
	// }
</script>

<script lang="ts">
	import { browser } from '$app/env';

	import CartPage from '$lib/components/Cart';

	import { cart } from '$lib/stores/cart';
	import { onMount } from 'svelte';

	browser && console.debug('in cartPage');

	onMount(() => {
		browser && console.debug('in cartPage onMount');
	});
</script>

<CartPage store={cart} cart={$cart.cart} state={$cart.state} />
