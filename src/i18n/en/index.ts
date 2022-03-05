import type { Translation } from '../i18n-types';

const en: Translation = {
	connectionStatus: 'You are currently offline',
	save: 'Save',
	addToCart: '',
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
	footer: {
		about: 'About {shopname}',
		deliverytimes: 'Deliverytimes',
	},
};

export default en;
