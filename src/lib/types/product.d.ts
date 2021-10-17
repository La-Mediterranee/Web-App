type SKU = string;
type ID = string;

export type Variations = DeepReadonly<{
	toppings?: string[];
}>;

export interface Image {
	readonly src: string;
	readonly alt?: string;
}

export interface Product {
	readonly ID: ID;
	readonly sku?: SKU;
	readonly name: string;
	readonly description: string;
	readonly price: number;
	readonly image: readonly Image;
	readonly categories: readonly string[];
	readonly variations: readonly Variations;
	readonly rating?: {
		readonly value: number;
		readonly count: number;
	};
}

export interface CartItem extends Product {
	quantity: number;
}
