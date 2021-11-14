import type { Translation } from '../i18n-types';

const en: Translation = {
	connectionStatus: 'You are currently offline',
	login: 'Login',
	signUp: 'Sign Up',
	nav: {
		desktop: {
			arialabel: 'desktop primary',
			routes: {
				homepage: 'Homepage',
				food: 'Food',
				drinks: 'Drinks',
			},
		},
		mobile: {
			arialabel: 'mobile primary',
			routes: {
				homepage: 'Homepage',
				food: 'Food',
				drinks: 'Drinks',
				profile: 'Profile',
				cart: 'Cart',
			},
		},
	},
	productQuantity: 'Quantity',
	addToCart: '',
	footer: {
		about: 'About {shopname}',
		deliverytimes: 'Deliverytimes',
	},
};

export default en;
