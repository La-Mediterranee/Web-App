import { readable } from 'svelte/store';
import { loadStripe } from '@stripe/stripe-js';

export function createStore() {
	const stripe = await loadStripe(
		'pk_test_51IsAVoEBqS7ZzpBPUULWoOWoAa3kwI4PBidbVa1qWO9Xk9ELB82exXCnVqsdsBWL2PYhGD2r1LKSdQgXKAKhimdr00x0ZYKGdg'
	);
}
