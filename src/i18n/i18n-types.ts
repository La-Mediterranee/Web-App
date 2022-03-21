// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType & DisallowNamespaces
export type BaseLocale = 'de'

export type Locales =
	| 'ar'
	| 'de'
	| 'en'

export type Translation = RootTranslation & DisallowNamespaces

export type Translations = RootTranslation &
{
	errors: NamespaceErrorsTranslation
}

type RootTranslation = {
	/**
	 * Sie sind derzeit Offline
	 */
	connectionStatus: string
	/**
	 * Speichern
	 */
	save: string
	nav: {
		/**
		 * Sekundär
		 */
		navbarAriaLabel: string
		routes: {
			/**
			 * Startseite
			 */
			homepage: string
			/**
			 * Speisen
			 */
			food: string
			/**
			 * Getränke
			 */
			drinks: string
			/**
			 * Profil
			 */
			account: string
			/**
			 * Warenkorb
			 */
			cart: string
		}
	}
	cart: {
		/**
		 * Warenkorb
		 */
		cart: string
		/**
		 * Warenkorb Artikel
		 */
		cartItems: string
		header: {
			/**
			 * Produkt
			 */
			product: string
			/**
			 * Preis
			 */
			price: string
			/**
			 * Anzahl
			 */
			quantity: string
		}
		/**
		 * Anmerkungen
		 */
		remarks: string
		/**
		 * Anzahl
		 */
		qty: string
	}
	customer: {
		/**
		 * Konto
		 */
		account: string
		/**
		 * Sprache
		 */
		language: string
		/**
		 * Einstellungen
		 */
		settings: string
		/**
		 * Einloggen
		 */
		login: string
		/**
		 * Registrieren
		 */
		signUp: string
		/**
		 * Abmelden
		 */
		logout: string
		/**
		 * Zahlungsmethoden
		 */
		paymentMethods: string
		profile: {
			/**
			 * Sprache auswählen
			 */
			'select-language': string
		}
	}
	product: {
		/**
		 * Preis
		 */
		price: string
		/**
		 * In den Warenkorb
		 */
		addToCart: string
		/**
		 * Toppings Auswählen
		 */
		chooseOptions: string
	}
	menuItem: {
		label: {
			/**
			 * Speise
			 */
			food: string
			/**
			 * Getränk
			 */
			drink: string
		}
	}
	footer: {
		/**
		 * Über {shopname}
		 * @param {string} shopname
		 */
		about: RequiredParams<'shopname'>
		/**
		 * Lieferzeiten
		 */
		deliverytimes: string
	}
}

export type NamespaceErrorsTranslation = {
	/**
	 * Die gesuchte Seite existiert leider nicht
	 */
	'404': string
	/**
	 * Es gab einen Fehler auf unserem Server
	 */
	'500': string
}

export type Namespaces =
	| 'errors'

type DisallowNamespaces = {
	/**
	 * reserved for 'errors'-namespace\
	 * you need to use the `./errors/index.ts` file instead
	 */
	errors?: "[typesafe-i18n] reserved for 'errors'-namespace. You need to use the `./errors/index.ts` file instead."
}

export type TranslationFunctions = {
	/**
	 * Sie sind derzeit Offline
	 */
	connectionStatus: () => LocalizedString
	/**
	 * Speichern
	 */
	save: () => LocalizedString
	nav: {
		/**
		 * Sekundär
		 */
		navbarAriaLabel: () => LocalizedString
		routes: {
			/**
			 * Startseite
			 */
			homepage: () => LocalizedString
			/**
			 * Speisen
			 */
			food: () => LocalizedString
			/**
			 * Getränke
			 */
			drinks: () => LocalizedString
			/**
			 * Profil
			 */
			account: () => LocalizedString
			/**
			 * Warenkorb
			 */
			cart: () => LocalizedString
		}
	}
	cart: {
		/**
		 * Warenkorb
		 */
		cart: () => LocalizedString
		/**
		 * Warenkorb Artikel
		 */
		cartItems: () => LocalizedString
		header: {
			/**
			 * Produkt
			 */
			product: () => LocalizedString
			/**
			 * Preis
			 */
			price: () => LocalizedString
			/**
			 * Anzahl
			 */
			quantity: () => LocalizedString
		}
		/**
		 * Anmerkungen
		 */
		remarks: () => LocalizedString
		/**
		 * Anzahl
		 */
		qty: () => LocalizedString
	}
	customer: {
		/**
		 * Konto
		 */
		account: () => LocalizedString
		/**
		 * Sprache
		 */
		language: () => LocalizedString
		/**
		 * Einstellungen
		 */
		settings: () => LocalizedString
		/**
		 * Einloggen
		 */
		login: () => LocalizedString
		/**
		 * Registrieren
		 */
		signUp: () => LocalizedString
		/**
		 * Abmelden
		 */
		logout: () => LocalizedString
		/**
		 * Zahlungsmethoden
		 */
		paymentMethods: () => LocalizedString
		profile: {
			/**
			 * Sprache auswählen
			 */
			'select-language': () => LocalizedString
		}
	}
	product: {
		/**
		 * Preis
		 */
		price: () => LocalizedString
		/**
		 * In den Warenkorb
		 */
		addToCart: () => LocalizedString
		/**
		 * Toppings Auswählen
		 */
		chooseOptions: () => LocalizedString
	}
	menuItem: {
		label: {
			/**
			 * Speise
			 */
			food: () => LocalizedString
			/**
			 * Getränk
			 */
			drink: () => LocalizedString
		}
	}
	footer: {
		/**
		 * Über {shopname}
		 */
		about: (arg: { shopname: string }) => LocalizedString
		/**
		 * Lieferzeiten
		 */
		deliverytimes: () => LocalizedString
	}
	errors: {
		/**
		 * Die gesuchte Seite existiert leider nicht
		 */
		'404': () => LocalizedString
		/**
		 * Es gab einen Fehler auf unserem Server
		 */
		'500': () => LocalizedString
	}
}

export type Formatters = {}
