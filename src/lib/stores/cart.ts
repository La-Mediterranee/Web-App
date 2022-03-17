import { onMount } from 'svelte';
import { browser } from '$app/env';
import { writable } from 'svelte/store';
// import { openDB } from 'idb';
import { get, set as keyvalSet } from 'idb-keyval';

import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CartItem, ID } from 'types/product';
import type { Invalidator } from 'types/index';
import type { IDBPDatabase } from 'idb';

type CartItems = Map<ID, CartItem>;

export interface Cart {
	readonly totalAmount: number;
	readonly totalQuantity: number;
	readonly displayTotalAmount: string;
	readonly items: CartItems;
}

export interface CartStore {
	subscribe: (
		this: void,
		run: Subscriber<CartWithState>,
		invalidate?: Invalidator<CartWithState> | undefined,
	) => Unsubscriber;
	addItem: (item: CartItem) => void;
	removeItem: (oldItem: CartItem) => void;
	removeAll: () => void;
	upadateItem: (id: ID, quantity: number) => void;
	setState(newState: CartState): void;
}

class ClientCart implements Cart {
	totalAmount = 0;
	totalQuantity = 0;
	displayTotalAmount = '0';

	private _totalAmount = 0;

	constructor(public readonly items: CartItems) {}
}

const SHOP_DB = 'shop-db';
const CART_STORE_KEY = 'cart';

const storage = typeof localStorage !== 'undefined' ? localStorage : null;

export type CartState = 'Loading' | 'Done'; //| 'Animating';
export interface CartWithState {
	state: CartState;
	cart: ClientCart;
}

export function formatPrice(amount: number) {
	return new Intl.NumberFormat('de-DE', {
		style: 'currency',
		currency: 'EUR',
	}).format(amount / 100);
}

function createCartStore(startItems: CartItems = new Map()): CartStore {
	const sound = browser ? new Audio('') : null;

	const startCart = new ClientCart(startItems);
	// calculateTotal(start);

	const start: CartWithState = {
		cart: startCart,
		state: 'Loading',
	};

	const store = writable<CartWithState>(start, set => {
		onMount(async () => {
			let cart: ClientCart;
			try {
				cart = (await get(CART_STORE_KEY)) || startCart;
				cart.items.set('1312', {
					ID: '1312',
					name: 'Burger',
					categories: ['burger'],
					isAvailable: true,
					isVegetarian: false,
					desc: '',
					category: 'Burger',
					image: {
						src: '/burger.webp',
					},
					toppings: [],
					selectedToppings: [],
					price: 830,
					quantity: 1,
				});
			} catch (error) {
				console.error(error);
			}

			cart ||= startCart;
			calculateTotal(cart);

			set({
				cart: cart,
				state: 'Done',
			});
		});

		return () => {
			sound?.pause();
			storage?.setItem(CART_STORE_KEY, JSON.stringify(cart));
			db?.close();
		};
	});

	const { subscribe, update } = store;

	let db: IDBPDatabase<Cart>;

	/*
	 	TODO: Add localstorage for persistent
	 	Optional: sync with firestore
	*/

	function addItem(item: CartItem) {
		try {
			// sound?.play();

			// update(cart => {
			// 	cart.items.set(item.ID, item);
			// 	calculateTotal(cart);
			// 	db.put(SHOP_DB, cart, CART_STORE_KEY);
			// 	return cart;
			// });

			update(store => {
				store.cart.items.set(item.ID, item);
				calculateTotal(store.cart);
				// db.put(SHOP_DB, store.cart, CART_STORE_KEY);
				keyvalSet(CART_STORE_KEY, store.cart);
				return store;
			});
		} catch (error) {
			console.error(error);
		}
	}

	async function removeItem(oldItem: CartItem) {
		try {
			// sound?.play();

			// update(cart => {
			// 	store.cart.items.delete(oldItem.ID || oldItem.name);
			// 	calculateTotal(cart);
			// 	db.put(SHOP_DB, cart, CART_STORE_KEY);
			// 	return cart;
			// });

			update(store => {
				// store.state = 'Animating';
				store.cart.items.delete(oldItem.ID);
				calculateTotal(store.cart);
				// db.put(SHOP_DB, store.cart, CART_STORE_KEY);
				keyvalSet(CART_STORE_KEY, store.cart);
				return store;
			});
		} catch (_e) {
			console.error(_e);
		}
	}

	function upadateItem(id: ID, quantity: number) {
		// sound?.play();

		// update(cart => {
		// 	const item = cart.items.get(id);
		// 	if (item) {
		// 		cart.items.set(id, {
		// 			...item,
		// 			quantity,
		// 		});
		// 		calculateTotal(cart);
		// 		db.put(SHOP_DB, cart, CART_STORE_KEY);
		// 	}
		// 	return cart;
		// });
		update(store => {
			const item = store.cart.items.get(id);
			if (item) {
				store.cart.items.set(id, {
					...item,
					quantity,
				});
				calculateTotal(store.cart);
				// db.put(SHOP_DB, store.cart, CART_STORE_KEY);
				keyvalSet(CART_STORE_KEY, store.cart);
			}
			return store;
		});
	}

	function removeAll() {
		sound?.play();
		// update(cart => {
		// 	cart.totalQuantity = 0;
		// 	cart.totalAmount = 0;
		// 	cart.items.clear();
		// 	db.add(SHOP_DB, cart, CART_STORE_KEY);
		// 	return cart;
		// });
		update(store => {
			store.cart.totalQuantity = 0;
			store.cart.totalAmount = 0;
			store.cart.displayTotalAmount = formatPrice(0);
			store.cart.items.clear();
			// db.put(SHOP_DB, store.cart, CART_STORE_KEY);
			keyvalSet(CART_STORE_KEY, store.cart);
			return store;
		});
		// or
		// store.set(new Map<SKU, CartItem>())
	}

	function calculateTotal(cart: ClientCart) {
		let amount = 0;
		let quantity = 0;

		for (const [id, item] of cart.items) {
			amount += item.price * item.quantity;
			quantity += item.quantity;
		}

		cart.totalQuantity = quantity;
		cart.totalAmount = amount;
		cart.displayTotalAmount = formatPrice(cart.totalAmount);

		// storage?.setItem(CART_STORE_KEY, JSON.stringify(cart));
	}

	function setState(newState: CartState) {
		update(store => {
			store.state = newState;
			return store;
		});
	}

	return {
		subscribe,
		removeItem,
		addItem,
		removeAll,
		upadateItem,
		setState,
	};
}

// export const cart = (() => {
// 	const items =
// 		storage?.getItem(CART_STORE_KEY) != null
// 			? (JSON.parse(storage.getItem(CART_STORE_KEY)!) as Cart)
// 			: undefined;
// 	return createCartStore(items);
// })();

// const dummyCart: CartItems = new Map([
// 	[
// 		'1312',
// 		{
// 			ID: '1312',
// 			name: 'Burger',
// 			categories: ['burger'],
// 			description: '',
// 			image: {
// 				src: '/burger.webp',
// 			},
// 			toppings: [],
// 			selectedToppings: [],
// 			price: 830,
// 			quantity: 1,
// 		},
// 	],
// 	[
// 		'1322',
// 		{
// 			ID: '1322',
// 			name: 'Burger',
// 			categories: ['burger'],
// 			description: '',
// 			image: {
// 				src: '/burger.webp',
// 			},
// 			toppings: [],
// 			selectedToppings: [],
// 			price: 890,
// 			quantity: 1,
// 		},
// 	],
// ]);

export const cart = createCartStore();
