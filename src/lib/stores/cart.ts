import { browser } from '$app/env';
import { writable } from 'svelte/store';

import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CartItem, ID } from 'types/product';
import type { Invalidator } from 'types/index';

export type Cart = Map<ID, CartItem>;

interface CartStore {
	subscribe: (
		this: void,
		run: Subscriber<Cart>,
		invalidate?: Invalidator<Cart> | undefined
	) => Unsubscriber;
	removeItem: (oldItem: CartItem) => void;
	addItem: (oldItem: CartItem) => void;
	removeAll: (oldItem: CartItem) => void;
	upadateItem: (id: ID, quantity: number) => void;
	readonly totalQuantity: number;
	readonly totalAmount: number;
}

const CART_STORE_KEY = 'cart';
const storage = typeof localStorage !== 'undefined' ? localStorage : null;

function createCartStore(startItems: Cart = new Map()): CartStore {
	let totalAmount = 0;
	let totalQuantity = 0;

	const items = startItems;

	const sound = browser ? new Audio('') : null;

	const store = writable<Cart>(items, () => {
		return () => {
			sound?.pause();
			storage?.setItem(CART_STORE_KEY, JSON.stringify(items));
		};
	});

	const { subscribe, update } = store;

	/*
	 	TODO: Add localstorage for persistent
	 	Optional: sync with firestore
	*/

	function addItem(item: CartItem) {
		sound?.play();
		update(items => {
			items.set(item.ID, item);
			calculateTotal(items);
			return items;
		});
	}

	function removeItem(oldItem: CartItem) {
		sound?.play();
		update(items => {
			items.delete(oldItem.ID || oldItem.name);
			calculateTotal(items);
			return items;
		});
	}

	function upadateItem(id: ID, quantity: number) {
		sound?.play();
		update(items => {
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
		storage?.setItem(CART_STORE_KEY, JSON.stringify(items));
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

// export const cart = (() => {
// 	const items =
// 		storage?.getItem(CART_STORE_KEY) != null
// 			? (JSON.parse(storage.getItem(CART_STORE_KEY)!) as Cart)
// 			: undefined;
// 	return createCartStore(items);
// })();

const dummyCart: Cart = new Map([
	[
		'1312',
		{
			ID: '1312',
			name: 'Burger',
			categories: ['burger'],
			description: '',
			image: {
				src: '/burger.webp',
			},
			price: 2.3,
			quantity: 1,
		},
	],
	[
		'1322',
		{
			ID: '1322',
			name: 'Burger',
			categories: ['burger'],
			description: '',
			image: {
				src: '/burger.webp',
			},
			price: 2.3,
			quantity: 1,
		},
	],
]);

export const cart = createCartStore(dummyCart);
