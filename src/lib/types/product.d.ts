type SKU = string;
type ID = string;

export interface Variations {}

interface Allergen {
	readonly ID: ID;
	readonly desc: string;
}

export interface ToppingOption {
	readonly ID: ID;
	readonly name: string;
	readonly desc: string;
	readonly price: number;
	readonly allergens: Allergen[];
	readonly image: Image;
}

export interface Topping {
	readonly ID: ID;
	readonly name: string;
	readonly desc: string;
	readonly options: readonly ToppingOption[];
	readonly qtyMin: number;
	readonly qtyMax: number;
}

export interface Image {
	readonly src: string;
	readonly alt?: string;
	readonly width?: number;
	readonly height?: number;
}

type CategoryType = 'grocery' | 'menuitem';

interface IProduct {
	readonly ID: ID;
	readonly categoryType: CategoryType;
	readonly name: string;
	readonly desc?: string;
	readonly price: number;
	readonly image: Image;
}

export interface Product extends IProduct {
	readonly categoryType: 'Grocery';
	readonly sku?: SKU;
	readonly categories: readonly string[];
	readonly variations: readonly Variations[];
	readonly rating?: {
		readonly value: number;
		readonly count: number;
	};
}

interface MenuItemSale {
	readonly price: number;
	readonly start: Date;
	readonly end: Date;
}

export type AllgenKeys =
	| 'A'
	| 'B'
	| 'C'
	| 'D'
	| 'E'
	| 'F'
	| 'G'
	| 'H'
	| 'L'
	| 'M'
	| 'N'
	| 'O'
	| 'P'
	| 'R';

export interface MenuItem extends IProduct {
	readonly categoryType: 'Menuitem';
	readonly type: 'drink' | 'food';
	readonly salesPrice?: number;
	readonly isAvailable: boolean;
	readonly isVegetarian: boolean;
	readonly image: Image;
	readonly category: string;
	readonly toppings: readonly Topping[];
	readonly allergens: readonly AllgenKeys[];
	readonly sale?: MenuItemSale;
}

interface ICartItem {
	// cartId: string;
	quantity: number;
}

export interface GroceryCartItem extends ICartItem, Product {
	readonly selectedVariations: Variations[];
}

export interface SelectedTopping {
	readonly toppingID: ID;
	readonly toppingOptionsIds: ToppingOption[];
}

export interface MenuCartItem extends ICartItem, MenuItem {
	readonly selectedToppings: SelectedTopping[];
	// readonly selectedToppings?: {
	// 	readonly [toppingID: ID]: ToppingOption | ToppingOption[];
	// }
}

export type CartItem = GroceryCartItem | MenuCartItem;
