import { browser } from '$app/env';
import { writable } from 'svelte/store';

import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CartItem, SKU } from 'types/interfaces';

type Cart = Map<SKU, CartItem>;

interface CartStore {
	subscribe: (
		this: void,
		run: Subscriber<Cart>,
		invalidate?: Invalidator<Cart> | undefined
	) => Unsubscriber;
	removeItem: (oldItem: CartItem) => void;
	addItem: (oldItem: CartItem) => void;
	removeAll: (oldItem: CartItem) => void;
	upadateItem: (sku: SKU, quantity: number) => void;
	readonly totalQuantity: number;
	readonly totalAmount: number;
}

function createCartStore(): CartStore {
	let totalAmount = 0;
	let totalQuantity = 0;

	const sound = browser ? new Audio('') : null;

	const key = 'cart';
	const storage = typeof localStorage !== 'undefined' ? localStorage : null;

	const items =
		storage?.getItem(key) != null
			? (JSON.parse(storage.getItem(key)!) as Cart)
			: new Map<SKU, CartItem>();

	const store = writable<Cart>(items, (set) => {
		return () => {
			sound?.pause();
			storage?.setItem(key, JSON.stringify(items));
		};
	});

	const { subscribe, update } = store;

	/*
	 	TODO: Add localstorage for persistent
	 	Optional: sync with firestore
	*/

	function addItem(item: CartItem) {
		sound?.play();
		update((items) => {
			items.set(item.sku || item.name, item);
			calculateTotal(items);
			return items;
		});
	}

	function removeItem(oldItem: CartItem) {
		sound?.play();
		update((items) => {
			items.delete(oldItem.sku || oldItem.name);
			calculateTotal(items);
			return items;
		});
	}

	function upadateItem(sku: SKU, quantity: number) {
		sound?.play();
		update((items) => {
			const item = items.get(sku);
			if (item) {
				items.set(sku, {
					...item,
					quantity,
				});
				calculateTotal(items);
			}
			return items;
		});
	}

	function removeAll() {
		sound?.play();
		update(() => {
			items.clear();
			return items;
		});
		// or
		// store.set(new Map<SKU, CartItem>())
	}

	function calculateTotal(items: Cart) {
		let amount = 0;
		let quantity = 0;

		for (const [sku, item] of items) {
			amount += item.price * item.quantity;
			quantity += item.quantity;
		}

		totalAmount = amount;
		totalQuantity = quantity;
		storage?.setItem(key, JSON.stringify(items));
	}

	return {
		subscribe,
		removeItem,
		addItem,
		removeAll,
		upadateItem,
		totalAmount,
		totalQuantity,
	};
}

export const cart = createCartStore();

// function createCartArrayStore(): CartStore {
// 	let totalAmount = 0;
// 	let totalQuantity = 0;

// 	const sound = new Audio('');
// 	const key = 'cart';
// 	const storage = typeof localStorage !== 'undefined' ? localStorage : null;
// 	const items =
// 		storage?.getItem(key) != null
// 			? (JSON.parse(storage.getItem(key)!) as CartItem[])
// 			: [];

// 	const store = writable<CartItem[]>(items, (set) => {
// 		return () => {
// 			storage?.setItem(key, JSON.stringify(items));
// 		};
// 	});

// 	const { set, subscribe, update } = store;

// 	/*
// 	 	TODO: Add localstorage for persistent
// 	 	Optional: sync with firestore
// 	*/

// 	function addItem(item: CartItem) {
// 		update((items) => {
// 			items.push(item); // or [...items, item] but instead of copying I just push and return
// 			calculateTotal(items);
// 			return items;
// 		});
// 	}

// 	function removeItem(oldItem: CartItem) {
// 		update((items) => {
// 			const newItems = items.filter((item) => item.sku !== oldItem.sku);
// 			calculateTotal(newItems);
// 			return newItems;
// 		});
// 	}

// 	function upadateItem(sku: SKU, quantity: number) {
// 		update((items) => {
// 			items[items.findIndex((item) => item.sku === sku)].quantity =
// 				quantity;
// 			calculateTotal(items);
// 			return items;
// 		});
// 	}

// 	function removeAll() {
// 		set([]);
// 	}

// 	function calculateTotal(items: CartItem[]) {
// 		let amount = 0;
// 		let quantity = 0;

// 		for (const item of items) {
// 			amount += item.price * item.quantity;
// 			quantity += item.quantity;
// 		}

// 		totalAmount = amount;
// 		totalQuantity = quantity;
// 		storage?.setItem(key, JSON.stringify(items));
// 	}

// 	return {
// 		subscribe,
// 		removeItem,
// 		addItem,
// 		removeAll,
// 		upadateItem,
// 		totalAmount,
// 		totalQuantity,
// 	};
// }
