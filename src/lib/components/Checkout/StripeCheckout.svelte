<script lang="ts">
	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';

	import { fetchFromAPI } from '$lib/utils';

	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	import type { Stripe } from '@stripe/stripe-js';

	interface Product {
		name: string;
		description: string;
		images: string[];
		amount: number;
		currency: 'eur';
		quantity: number;
	}

	const product: Product = {
		name: '',
		description: '',
		images: [''],
		amount: 0,
		currency: 'eur',
		quantity: 0,
	};

	let stripe: Stripe | null = null;

	onMount(async () => {
		stripe = await loadStripe(STRIPE_PUBLIC_KEY);
	});

	function changeQuantity(v: number) {
		product.quantity = Math.max(0, product.quantity + v);
	}

	async function handleClick(event: Event) {
		const body = { line_items: [product] };
		const { id: sessionId } = await fetchFromAPI('checkout', {
			body,
		});

		if (!stripe) {
			return;
		}

		const { error } = await stripe.redirectToCheckout({
			sessionId,
		});

		if (error) {
			console.log(error);
		}
	}
</script>

<div>
	<h3>{product.name}</h3>
	<h4>Stripe Amount: {product.amount}</h4>
	<img src={product.images[0]} width="250px" alt="product" />
	<button on:click={() => changeQuantity(-1)} disabled={product.quantity === 1}> - </button>
	<button on:click={() => changeQuantity(1)} disabled={product.quantity >= 50}> + </button>
	<span> {product.quantity} </span>
</div>

<hr />

<button on:click={handleClick}> Start Checkout </button>

<style>
	/* your styles go here */
</style>
