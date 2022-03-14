import type { BaseTranslation } from '../i18n-types';

const de: BaseTranslation = {
	connectionStatus: 'Sie sind derzeit Offline',
	save: 'Speichern',
	nav: {
		navbarAriaLabel: 'Sekundär',
		routes: {
			homepage: 'Startseite',
			food: 'Speisen',
			drinks: 'Getränke',
			account: 'Profil',
			cart: 'Warenkorb',
		},
	},
	cart: {
		cart: 'Warenkorb',
		cartItems: 'Warenkorb Artikel',
		header: {
			product: 'Produkt',
			price: 'Preis',
			quantity: 'Anzahl',
		},
		remarks: 'Anmerkungen',
		qty: 'Anzahl',
	},
	customer: {
		account: 'Konto',
		language: 'Sprache',
		settings: 'Einstellungen',
		login: 'Einloggen',
		signUp: 'Registrieren',
		logout: 'Abmelden',
		paymentMethods: 'Zahlungsmethoden',
		profile: {
			'select-language': 'Sprache auswählen',
		},
	},
	product: {
		price: 'Preis',
		addToCart: 'In den Warenkorb',
		chooseOptions: 'Toppings Auswählen',
	},
	footer: {
		about: 'Über {shopname: string}',
		deliverytimes: 'Lieferzeiten',
	},
};

export default de;
