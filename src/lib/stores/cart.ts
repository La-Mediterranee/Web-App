import { writable } from 'svelte/store';

function createCartStore() {
	const store = writable<CartItem[]>([]);

	const { set, subscribe, update } = store;

	/*
	 	TODO: Add localstorage for persistent
	 	Optional: sync with firestore
	*/

	function removeItem(oldItem: CartItem) {
		update((items) => items.filter((item) => item.sku !== oldItem.sku));
	}

	function addItem(item: CartItem) {
		update((items) => [...items, item]);
	}

	function upadateItem(sku: SKU, quantity: number) {
		update((items) => {
			items[items.findIndex((item) => item.sku === sku)].quantity = quantity;
			return items;
		});
	}

	function removeAll() {
		set([]);
	}

	return {
		subscribe,
		removeItem,
		addItem,
		removeAll,
		upadateItem
	};
}

export const cart = createCartStore();
