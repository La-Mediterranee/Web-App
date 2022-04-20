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
	checkout: NamespaceCheckoutTranslation,
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
		/**
		 * Ihr Warenkorb ist leer
		 */
		empty: string
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
			 * Teilsumme
			 */
			subtotal: string
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
		/**
		 * Gratis
		 */
		free: string
		/**
		 * Allergene
		 */
		allergens: string
		/**
		 * Weitere Information
		 */
		moreInfo: string
		/**
		 * Schließen
		 */
		close: string
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

export type NamespaceCheckoutTranslation = {
	deliveryDetails: {
		/**
		 * Lieferdetails
		 */
		title: string
		userInfo: {
			/**
			 * Kontaktinformation
			 */
			title: string
			/**
			 * E-Mail
			 */
			email: string
			/**
			 * Telefonnummer
			 */
			phone: string
			/**
			 * Vorname
			 */
			name: string
			/**
			 * Familienname
			 */
			surname: string
		}
		deliveryInfo: {
			/**
			 * Lieferadresse
			 */
			title: string
			/**
			 * Adresse
			 */
			street: string
			/**
			 * Stadt
			 */
			city: string
			/**
			 * PLZ
			 */
			postalCode: string
		}
		/**
		 * Zur Zahlung
		 */
		next: string
	}
	paymentDetails: {
		/**
		 * Zahlungsdetails
		 */
		title: string
		tip: {
			/**
			 * Trinkgeld
			 */
			title: string
			/**
			 * Benutzerdefiniertes Trinkgeld
			 */
			customTip: string
		}
		payment: {
			/**
			 * Zahlungsmethode
			 */
			title: string
			creditCard: {
				/**
				 * Kreditkarte
				 */
				title: string
				/**
				 * Kartennummer
				 */
				cardNumber: string
				/**
				 * Gültig bis
				 */
				expiration: string
				/**
				 * Prüfzahl/CVC
				 */
				cvc: string
			}
			/**
			 * Sofort Überweisung
			 */
			sofort: string
			/**
			 * Barzahlung
			 */
			cash: string
		}
		/**
		 * Zurück zu Lieferdetails
		 */
		prev: string
		/**
		 * Zur Zusammenfassung
		 */
		next: string
	}
	summary: {
		/**
		 * Zusammenfassung
		 */
		title: string
		/**
		 * Zurück zu Zahlungsdetails
		 */
		prev: string
		/**
		 * Bestellung bestätigen
		 */
		next: string
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
	| 'checkout'
	| 'errors'

type DisallowNamespaces = {
	/**
	 * reserved for 'checkout'-namespace\
	 * you need to use the `./checkout/index.ts` file instead
	 */
	checkout?: "[typesafe-i18n] reserved for 'checkout'-namespace. You need to use the `./checkout/index.ts` file instead."

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
		/**
		 * Ihr Warenkorb ist leer
		 */
		empty: () => LocalizedString
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
			 * Teilsumme
			 */
			subtotal: () => LocalizedString
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
		/**
		 * Gratis
		 */
		free: () => LocalizedString
		/**
		 * Allergene
		 */
		allergens: () => LocalizedString
		/**
		 * Weitere Information
		 */
		moreInfo: () => LocalizedString
		/**
		 * Schließen
		 */
		close: () => LocalizedString
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
	checkout: {
		deliveryDetails: {
			/**
			 * Lieferdetails
			 */
			title: () => LocalizedString
			userInfo: {
				/**
				 * Kontaktinformation
				 */
				title: () => LocalizedString
				/**
				 * E-Mail
				 */
				email: () => LocalizedString
				/**
				 * Telefonnummer
				 */
				phone: () => LocalizedString
				/**
				 * Vorname
				 */
				name: () => LocalizedString
				/**
				 * Familienname
				 */
				surname: () => LocalizedString
			}
			deliveryInfo: {
				/**
				 * Lieferadresse
				 */
				title: () => LocalizedString
				/**
				 * Adresse
				 */
				street: () => LocalizedString
				/**
				 * Stadt
				 */
				city: () => LocalizedString
				/**
				 * PLZ
				 */
				postalCode: () => LocalizedString
			}
			/**
			 * Zur Zahlung
			 */
			next: () => LocalizedString
		}
		paymentDetails: {
			/**
			 * Zahlungsdetails
			 */
			title: () => LocalizedString
			tip: {
				/**
				 * Trinkgeld
				 */
				title: () => LocalizedString
				/**
				 * Benutzerdefiniertes Trinkgeld
				 */
				customTip: () => LocalizedString
			}
			payment: {
				/**
				 * Zahlungsmethode
				 */
				title: () => LocalizedString
				creditCard: {
					/**
					 * Kreditkarte
					 */
					title: () => LocalizedString
					/**
					 * Kartennummer
					 */
					cardNumber: () => LocalizedString
					/**
					 * Gültig bis
					 */
					expiration: () => LocalizedString
					/**
					 * Prüfzahl/CVC
					 */
					cvc: () => LocalizedString
				}
				/**
				 * Sofort Überweisung
				 */
				sofort: () => LocalizedString
				/**
				 * Barzahlung
				 */
				cash: () => LocalizedString
			}
			/**
			 * Zurück zu Lieferdetails
			 */
			prev: () => LocalizedString
			/**
			 * Zur Zusammenfassung
			 */
			next: () => LocalizedString
		}
		summary: {
			/**
			 * Zusammenfassung
			 */
			title: () => LocalizedString
			/**
			 * Zurück zu Zahlungsdetails
			 */
			prev: () => LocalizedString
			/**
			 * Bestellung bestätigen
			 */
			next: () => LocalizedString
		}
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
