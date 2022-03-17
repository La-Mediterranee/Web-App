type SKU = string;
type ID = string;

export type Variations = DeepReadonly<{
	toppings?: Topping[];
}>;

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

export interface Product {
	readonly ID: ID;
	readonly sku?: SKU;
	readonly name: string;
	readonly desc?: string;
	readonly price: number;
	readonly image: Image;
	readonly categories: readonly string[];
	// readonly variations?: Variations;
	readonly rating?: {
		readonly value: number;
		readonly count: number;
	};
}

export interface MenuItem {
	readonly ID: ID;
	readonly name: string;
	readonly desc?: string;
	readonly price: number;
	readonly salesPrice?: number;
	readonly isAvailable: boolean;
	readonly isVegetarian: boolean;
	readonly image: Image;
	readonly category: string;
	readonly toppings: readonly Topping[];
}

export interface CartItem extends Product, MenuItem {
	quantity: number;
	selectedToppings: readonly ToppingOption[];
}
