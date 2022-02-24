<script context="module" lang="ts">
	// export async function load() {
	// 	return {};
	// }
</script>

<script lang="ts">
	import CartPage from '$lib/components/Cart';

	import { cart } from '$lib/stores/cart';

	console.debug();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<CartPage store={cart} cart={$cart} />
