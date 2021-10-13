import { browser } from '$app/env';
import { writable } from 'svelte/store';

import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CartItem, SKU, ID } from 'types/interfaces';

export type Cart = Map<ID, CartItem>;

interface CartStore {
	subscribe: (this: void, run: Subscriber<Cart>, invalidate?: Invalidator<Cart> | undefined) => Unsubscriber;
	removeItem: (oldItem: CartItem) => void;
	addItem: (oldItem: CartItem) => void;
	removeAll: (oldItem: CartItem) => void;
	upadateItem: (id: ID, quantity: number) => void;
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
		storage?.getItem(key) != null ? (JSON.parse(storage.getItem(key)!) as Cart) : new Map<SKU, CartItem>();

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
			items.set(item.ID, item);
			calculateTotal(items);
			return items;
		});
	}

	function removeItem(oldItem: CartItem) {
		sound?.play();
		update((items) => {
			items.delete(oldItem.ID || oldItem.name);
			calculateTotal(items);
			return items;
		});
	}

	function upadateItem(id: ID, quantity: number) {
		sound?.play();
		update((items) => {
			const item = items.get(id);
			if (item) {
				items.set(id, {
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

		for (const [id, item] of items) {
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
