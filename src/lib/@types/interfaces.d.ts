import { Image } from './index';

type SKU = string;
type ID = string;

type Variations = DeepReadonly<{
	toppings?: string[];
}>;

interface Product {
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

interface CartItem extends Product {
	quantity: number;
}
