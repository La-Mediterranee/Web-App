<script context="module" lang="ts">
	// export async function load() {
	// 	return {};
	// }
</script>

<script lang="ts">
	import CartPage from '$lib/components/Cart';

	import { cart } from '$lib/stores/cart';
</script>

<CartPage cart={$cart} />
