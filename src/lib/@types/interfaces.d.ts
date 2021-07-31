type SKU = string;

interface Product {
	readonly sku?: SKU;
	readonly name: string;
	readonly price: number;
	readonly image: Image;
	readonly categories: string | string [];
	readonly rating?: {
		readonly value: number;
		readonly count: number;
	};
}

interface CartItem extends Product {
	quantity: number;
}
