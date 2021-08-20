import { writable } from 'svelte/store';

import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CartItem, SKU } from 'types/interfaces';

interface CartStore {
	subscribe: (
		this: void,
		run: Subscriber<CartItem[]>,
		invalidate?: Invalidator<CartItem[]> | undefined
	) => Unsubscriber;
	removeItem: (oldItem: CartItem) => void;
	addItem: (oldItem: CartItem) => void;
	removeAll: (oldItem: CartItem) => void;
	upadateItem: (sku: SKU, quantity: number) => void;
	readonly totalQuantity: number;
	readonly totalAmount: number;
}

interface Cart {
	items: CartItem[];
	totalAmount: number;
	totalQuantity: number;
}

function createCartStore(): CartStore {
	let totalAmount = 0;
	let totalQuantity = 0;
	const key = 'cart';
	const storage = typeof localStorage !== 'undefined' ? localStorage : null;
	const items =
		storage?.getItem(key) != null
			? (JSON.parse(storage.getItem(key)!) as CartItem[])
			: [];

	const store = writable<CartItem[]>(items);

	const { set, subscribe, update } = store;

	/*
	 	TODO: Add localstorage for persistent
	 	Optional: sync with firestore
	*/

	function removeItem(oldItem: CartItem) {
		update((items) => {
			const newItems = items.filter((item) => item.sku !== oldItem.sku);
			calculateTotal(newItems);
			return newItems;
		});
	}

	function addItem(item: CartItem) {
		update((items) => {
			items.push(item); // or [...items, item] but instead of copying I just push and return
			calculateTotal(items);
			return items;
		});
	}

	function upadateItem(sku: SKU, quantity: number) {
		update((items) => {
			items[items.findIndex((item) => item.sku === sku)].quantity =
				quantity;
			calculateTotal(items);
			return items;
		});
	}

	function calculateTotal(items: CartItem[]) {
		let amount = 0;
		let quantity = 0;

		for (const item of items) {
			amount += item.price * item.quantity;
			quantity += item.quantity;
		}

		totalAmount = amount;
		totalQuantity = quantity;
		storage?.setItem(key, JSON.stringify(items));
	}

	function removeAll() {
		set([]);
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
