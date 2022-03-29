import type { Translation } from '../i18n-types';

const en: Translation = {
	connectionStatus: 'You are currently offline',
	save: 'Save',
	nav: {
		navbarAriaLabel: 'secundary',
		routes: {
			homepage: 'Homepage',
			food: 'Food',
			drinks: 'Drinks',
			account: 'Profile',
			cart: 'Cart',
		},
	},
	cart: {
		cart: 'Cart',
		cartItems: 'Cart items',
		empty: 'No items in the cart yet',
		header: {
			product: 'Product',
			price: 'Price',
			quantity: 'Quantity',
		},
		remarks: 'Remarks',
		qty: 'Qty',
	},
	customer: {
		account: 'Account',
		language: 'Language',
		settings: 'Settings',
		login: 'Login',
		signUp: 'Sign Up',
		logout: 'Logout',
		paymentMethods: 'Payment methods',
		profile: {
			'select-language': 'Select Language',
		},
	},
	product: {
		price: 'Price',
		addToCart: 'Add to Cart',
		chooseOptions: 'Choose Toppings',
	},
	menuItem: {
		label: {
			food: 'Dish',
			drink: 'Drink',
		},
	},
	footer: {
		about: 'About {shopname}',
		deliverytimes: 'Deliverytimes',
	},
};

export default en;
