import type { BaseTranslation } from '../i18n-types';

const de: BaseTranslation = {
	connectionStatus: 'Sie sind derzeit Offline',
	login: 'Einloggen',
	signUp: 'Registrieren',
	nav: {
		desktop: {
			arialabel: 'desktop primär',
			routes: {
				homepage: 'Startseite',

				drinks: 'Getränke',
			},
		},
		mobile: {
			arialabel: 'mobil primär',
			routes: {
				homepage: 'Startseite',
				food: 'Essen',
				drinks: 'Getränke',
				account: 'Profil',
				cart: 'Warenkorb',
			},
		},
	},
	productQuantity: 'Menge',
	addToCart: '',
	footer: {
		about: 'Über {shopname: string}',
		deliverytimes: 'Lieferzeiten',
	},
};

export default de;
