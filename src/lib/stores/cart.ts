import { browser } from '$app/env';
import { writable } from 'svelte/store';

import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CartItem, ID } from 'types/product';
import type { Invalidator } from 'types/index';

type CartItems = Map<ID, CartItem>;

export interface Cart {
	readonly items: CartItems;
	totalAmount: number;
	totalQuantity: number;
}

export interface CartStore {
	subscribe: (
		this: void,
		run: Subscriber<Cart>,
		invalidate?: Invalidator<Cart> | undefined,
	) => Unsubscriber;
	addItem: (item: CartItem) => void;
	removeItem: (oldItem: CartItem) => void;
	removeAll: () => void;
	upadateItem: (id: ID, quantity: number) => void;
}

const CART_STORE_KEY = 'cart';
const storage = typeof localStorage !== 'undefined' ? localStorage : null;

function createCartStore(startItems: CartItems = new Map()): CartStore {
	const sound = browser ? new Audio('') : null;

	const cart = {
		items: startItems,
		totalAmount: 0,
		totalQuantity: 0,
	};

	calculateTotal(cart);

	const store = writable<Cart>(cart, () => {
		return () => {
			sound?.pause();
			storage?.setItem(CART_STORE_KEY, JSON.stringify(cart));
		};
	});

	const { subscribe, update } = store;

	/*
	 	TODO: Add localstorage for persistent
	 	Optional: sync with firestore
	*/

	function addItem(item: CartItem) {
		sound?.play();
		update(cart => {
			cart.items.set(item.ID, item);
			calculateTotal(cart);
			return cart;
		});
	}

	function removeItem(oldItem: CartItem) {
		sound?.play();
		update(cart => {
			cart.items.delete(oldItem.ID || oldItem.name);
			calculateTotal(cart);
			return cart;
		});
	}

	function upadateItem(id: ID, quantity: number) {
		sound?.play();
		update(cart => {
			const item = cart.items.get(id);
			if (item) {
				cart.items.set(id, {
					...item,
					quantity,
				});
				calculateTotal(cart);
			}
			return cart;
		});
	}

	function removeAll() {
		sound?.play();
		update(cart => {
			cart.totalQuantity = 0;
			cart.totalAmount = 0;
			cart.items.clear();
			return cart;
		});
		// or
		// store.set(new Map<SKU, CartItem>())
	}

	function calculateTotal(cart: Cart) {
		let amount = 0;
		let quantity = 0;

		for (const [id, item] of cart.items) {
			amount += item.price * item.quantity;
			quantity += item.quantity;
		}

		cart.totalAmount = amount;
		cart.totalQuantity = quantity;
		storage?.setItem(CART_STORE_KEY, JSON.stringify(cart));
	}

	return {
		subscribe,
		removeItem,
		addItem,
		removeAll,
		upadateItem,
	};
}

// export const cart = (() => {
// 	const items =
// 		storage?.getItem(CART_STORE_KEY) != null
// 			? (JSON.parse(storage.getItem(CART_STORE_KEY)!) as Cart)
// 			: undefined;
// 	return createCartStore(items);
// })();

const dummyCart: CartItems = new Map([
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
			toppings: [],
			price: 830,
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
			toppings: [],
			price: 890,
			quantity: 1,
		},
	],
]);

export const cart = createCartStore(dummyCart);
