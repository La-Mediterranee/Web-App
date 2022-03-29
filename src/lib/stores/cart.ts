import { onMount } from 'svelte';
import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { set as keyvalSet, get as keyvalGet } from 'idb-keyval';

import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CartItem, ID, SelectedTopping } from 'types/product';

export type CartItems = CartItem[];
export type CartItemIndecies = Map<ID, number[]>;

export interface Cart {
	readonly totalAmount: number;
	readonly totalQuantity: number;
	readonly displayTotalAmount: string;
	readonly items: CartItems;
}

class ClientCart implements Cart {
	totalAmount = 0;
	totalQuantity = 0;
	displayTotalAmount = '0';

	constructor(readonly items: CartItems = []) {}

	setItem(value: CartItem) {
		return this.items.push(value);
	}

	getItem(index: number) {
		return this.items[index];
	}

	deleteItem(index: number) {
		return this.items.splice(index, 1);
	}

	clear() {
		//@ts-ignore
		this.items = [];
	}
}

const SHOP_DB = 'shop-db';
const CART_STORE_KEY = 'cart';

function createKeyVal(): IStorage {
	return browser
		? {
				set: function <T>(key: string, value: T): void {
					keyvalSet(key, value);
				},
				get: function <T>(key: string): Promise<T | undefined> {
					return keyvalGet(key);
				},
		  }
		: {
				set: () => {},
				get: async () => undefined,
		  };
}

const keyval: IStorage = createKeyVal();

interface IStorage {
	set<T>(key: string, value: T): void;
	get<T>(key: string): Promise<T | undefined>;
}

class Storage {
	private _storage: IStorage;

	constructor(private readonly _storageKey: string = CART_STORE_KEY) {
		this._storage = keyval;
	}

	set<T>(value: T) {
		this._storage.set(this._storageKey, value);
	}

	async get<T>(): Promise<T | undefined> {
		return this._storage.get(this._storageKey);
	}
}

export type CartState = 'Loading' | 'Done'; //| 'Animating';
export interface CartWithState {
	state: CartState;
	cart: ClientCart;
}

export function formatPrice(amount: number, locale = 'de-DE') {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'EUR',
	}).format(amount / 100);
}

export async function digestMessage(message: string) {
	// encode as (utf-8) Uint8Array
	const msgUint8 = new TextEncoder().encode(message);
	// hash the message
	const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
	// convert buffer to byte array
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	// convert bytes to hex string
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

function createCartStore(startItems: CartItems = []) {
	const sound = browser ? new Audio('') : null;

	const storage = new Storage();
	const startCart = new ClientCart(startItems);

	const start: CartWithState = {
		cart: startCart,
		state: 'Loading',
	};

	function saveCart(items: CartItems) {
		storage.set(items);
	}

	const _items = new Map();

	const store = writable<CartWithState>(start, set => {
		let cart: ClientCart;
		onMount(async () => {
			try {
				cart = new ClientCart((await storage.get<CartItems>()) || startItems);
				const selectedToppings: SelectedTopping[] = [];
				const cartId = await digestMessage(
					'1312' +
						selectedToppings.reduce(
							(prev, s) =>
								prev +
								s.toppingID +
								s.toppingOptionsIds.reduce((prev, s) => prev + s.ID, ''),
							'',
						),
				);

				const item: CartItem = {
					cartId,
					ID: '1312',
					type: 'food',
					category: 'burger',
					categoryType: 'Menuitem',
					name: 'Burger',
					desc: '',
					isAvailable: true,
					isVegetarian: false,
					image: {
						src: '/burger.webp',
					},
					toppings: [],
					price: 830,
					quantity: 1,
					selectedToppings,
				};

				_items.set(cartId, item);
				cart.setItem(item);
			} catch (error) {
				console.error(error);
			}

			cart ||= startCart;
			calculateTotal(cart);

			set({
				cart: cart,
				state: 'Done',
			});

			return () => {
				sound?.pause();
				saveCart(cart.items);
			};
		});
	});

	const { subscribe, update } = store;

	async function addItem(item: Omit<CartItem, 'cartId'>) {
		try {
			const cartId = await digestMessage(
				item.ID +
					//@ts-ignore
					item.selectedToppings?.reduce(
						//@ts-ignore
						(prev, s) =>
							prev +
							s.toppingID +
							//@ts-ignore
							s.toppingOptionsIds.reduce((prev, s) => prev + s.ID, ''),
						'',
					),
			);

			//@ts-ignore
			item.cartId = cartId;

			if (_items.has(cartId)) return;
			// sound?.play();
			update(store => {
				//@ts-ignore
				_items.set(cartId);
				//@ts-ignore
				store.cart.setItem(item);
				calculateTotal(store.cart);
				saveCart(store.cart.items);
				return store;
			});
		} catch (error) {
			console.error(error);
		}
	}

	async function removeItem(index: number) {
		try {
			// sound?.play();

			update(store => {
				// store.state = 'Animating';
				store.cart.deleteItem(index);
				calculateTotal(store.cart);
				saveCart(store.cart.items);
				return store;
			});
		} catch (_e) {
			console.error(_e);
		}
	}

	function upadateItem(index: number, quantity: number) {
		// sound?.play();
		update(store => {
			const item = store.cart.getItem(index);
			if (item) {
				store.cart.setItem(
					Object.assign(item, {
						quantity,
					}),
				);
				calculateTotal(store.cart);
				saveCart(store.cart.items);
			}
			return store;
		});
	}

	function removeAll() {
		sound?.play();
		update(store => {
			store.cart.totalQuantity = 0;
			store.cart.totalAmount = 0;
			store.cart.displayTotalAmount = formatPrice(0);
			store.cart.clear();
			saveCart(store.cart.items);
			return store;
		});
	}

	function calculateTotal(cart: ClientCart) {
		let amount = 0;
		let quantity = 0;

		for (const item of cart.items) {
			amount += item.price * item.quantity;
			quantity += item.quantity;
		}

		cart.totalQuantity = quantity;
		cart.totalAmount = amount;
		cart.displayTotalAmount = formatPrice(cart.totalAmount);
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

export type CartStore = ReturnType<typeof createCartStore>;

export const cart = createCartStore();
