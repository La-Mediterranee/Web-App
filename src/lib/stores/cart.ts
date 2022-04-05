import { onMount } from 'svelte';
import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { set as keyvalSet, get as keyvalGet } from 'idb-keyval';

import type { CartItem, ID, MenuItem, SelectedTopping } from 'types/product';

// export type CartItems = CartItem[];
export type CartItemIndecies = Map<ID, number[]>;
export type CartItems = Map<ID, CartItem>;

export interface Cart {
	readonly state: CartState;
	readonly items: CartItems;
	readonly totalAmount: number;
	readonly totalQuantity: number;
	readonly displayTotalAmount: string;
}

export type CartState = 'Loading' | 'Empty' | 'Filled' | 'Done'; //| 'Animating';

interface LoadedCart {
	state: CartState;
	cart: ClientCart;
}

interface LoadingCart {
	state: 'Loading';
	cart: undefined;
}

export type CartWithState = LoadingCart | LoadedCart;

class ClientCart implements Cart {
	totalAmount = 0;
	totalQuantity = 0;
	displayTotalAmount = '0';

	constructor(public items: CartItems, public state: CartState = 'Loading') {}

	setItems(items: CartItems) {
		this.items = items;
	}

	setState(newState: CartState) {
		this.state = newState;
	}

	has(key: ID) {
		return this.items.has(key);
	}

	setItem(key: ID, item: CartItem) {
		return this.items.set(key, item);
	}

	getItem(id: ID) {
		return this.items.get(id);
	}

	deleteItem(id: ID) {
		return this.items.delete(id);
	}

	clear() {
		this.items.clear();
		this.totalAmount = 0;
		this.totalQuantity = 0;
		this.displayTotalAmount = formatPrice(0);
		this.setState('Empty');
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

function createMenuItemString(item: CartItem) {
	//@ts-ignore
	const toppingIds = item.selectedToppings.reduce(
		//@ts-ignore
		(prev, s) =>
			prev +
			s.toppingID +
			//@ts-ignore
			s.toppingOptionsIds.reduce((prev, s) => prev + s.ID, ''),
		'',
	);

	return item.ID + toppingIds;
}

function createCartStore(
	startItems: CartItems = new Map([
		[
			'1312',
			{
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
				selectedToppings: [],
			},
		],
	]),
) {
	const sound = browser ? new Audio('') : null;

	const storage = new Storage();

	const start: CartWithState = {
		state: 'Loading',
		cart: undefined,
	};

	function saveCart(items: CartItems) {
		storage.set(items);
	}

	const cart = new ClientCart(startItems);

	const store = writable<Cart>(cart, set => {
		// let cart: Promise<ClientCart>; // = new Promise((resolve)=> {});

		onMount(() => {
			(async function () {
				try {
					// cart = new ClientCart((await storage.get<CartItems>()) || startItems);
					cart.setItems((await storage.get<CartItems>()) || startItems);
					cart.setState(cart.items.size > 0 ? 'Filled' : 'Empty');
					calculateTotal(cart);
					set(cart);
				} catch (error) {
					console.error(error);
				}
			})();

			return () => {
				sound?.pause();
				saveCart(cart.items);
			};
		});
	});

	const { subscribe, update } = store;

	function onChange(store: ClientCart) {
		if (store.items.size === 0) {
			return store.setState('Empty');
		}

		store.setState('Filled');
	}

	async function addItem(item: CartItem) {
		try {
			const key = await digestMessage(createMenuItemString(item));
			// sound?.play();
			update(cart => {
				const loadedCart = <ClientCart>cart;
				let value = item;
				if (loadedCart.has(key)) {
					const item = loadedCart.getItem(key)!;
					item.quantity += 1;
					value = item;
				}
				loadedCart.setItem(key, value);
				calculateTotal(loadedCart);
				saveCart(loadedCart.items);
				onChange(loadedCart);
				return cart;
			});
		} catch (error) {
			console.error(error);
		}
	}

	async function removeItem(key: ID, index: number) {
		try {
			// sound?.play(); d
			update(cart => {
				const loadedCart = <ClientCart>cart;
				// store.state = 'Animating';
				loadedCart.deleteItem(key);
				calculateTotal(loadedCart);
				saveCart(loadedCart.items);
				onChange(loadedCart);
				return cart;
			});
		} catch (_e) {
			console.error(_e);
		}
	}

	function upadateItem(key: ID, index: number, quantity: number) {
		// sound?.play();
		update(cart => {
			const loadedCart = <ClientCart>cart;
			const item = loadedCart.getItem(key);
			if (item === undefined) return cart;

			loadedCart.setItem(
				key,
				Object.assign(item, {
					quantity,
				}),
			);
			calculateTotal(loadedCart);
			saveCart(loadedCart.items);
			onChange(loadedCart);
			return cart;
		});
	}

	function removeAll() {
		sound?.play();
		update(cart => {
			const loadedCart = <ClientCart>cart;
			loadedCart.clear();
			saveCart(loadedCart.items);
			return cart;
		});
	}

	function calculateTotal(cart: ClientCart) {
		let amount = 0;
		let quantity = 0;

		for (const [_, item] of cart.items) {
			amount += item.price * item.quantity;
			quantity += item.quantity;
		}

		cart.totalQuantity = quantity;
		cart.totalAmount = amount;
		cart.displayTotalAmount = formatPrice(cart.totalAmount);
	}

	return {
		subscribe,
		removeItem,
		addItem,
		removeAll,
		upadateItem,
	};
}

export type CartStore = ReturnType<typeof createCartStore>;

export const cart = createCartStore();
