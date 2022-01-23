// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'de'

export type Locales =
	| 'ar'
	| 'de'
	| 'en'

export type Translation = {
	/**
	 * Sie sind derzeit Offline
	 */
	'connectionStatus': string
	/**
	 * Speichern
	 */
	'save': string
	'addToCart': string
	'nav': {	
		'desktop': {	
			/**
			 * Desktop primär
			 */
			'arialabel': string
			'routes': {	
				/**
				 * Startseite
				 */
				'homepage': string
				/**
				 * Speisen
				 */
				'food': string
				/**
				 * Getränke
				 */
				'drinks': string
			}
		}
		'mobile': {	
			/**
			 * Mobil primär
			 */
			'arialabel': string
			'routes': {	
				/**
				 * Startseite
				 */
				'homepage': string
				/**
				 * Essen
				 */
				'food': string
				/**
				 * Getränke
				 */
				'drinks': string
				/**
				 * Profil
				 */
				'account': string
				/**
				 * Warenkorb
				 */
				'cart': string
			}
		}
	}
	'cart': {	
		/**
		 * Warenkorb
		 */
		'cart': string
		/**
		 * Anmerkungen
		 */
		'remarks': string
		/**
		 * Anzahl
		 */
		'qty': string
	}
	'customer': {	
		/**
		 * Konto
		 */
		'account': string
		/**
		 * Sprache
		 */
		'language': string
		/**
		 * Einstellungen
		 */
		'settings': string
		/**
		 * Einloggen
		 */
		'login': string
		/**
		 * Registrieren
		 */
		'signUp': string
		/**
		 * Abmelden
		 */
		'logout': string
		/**
		 * Zahlungsmethoden
		 */
		'paymentMethods': string
		'profile': {	
			/**
			 * Sprache auswählen
			 */
			'select-language': string
		}
	}
	'footer': {	
		/**
		 * Über {shopname}
		 * @param {string} shopname
		 */
		'about': RequiredParams1<'shopname'>
		/**
		 * Lieferzeiten
		 */
		'deliverytimes': string
	}
}

export type TranslationFunctions = {
	/**
	 * Sie sind derzeit Offline
	 */
	'connectionStatus': () => LocalizedString
	/**
	 * Speichern
	 */
	'save': () => LocalizedString
	'addToCart': () => LocalizedString
	'nav': {	
		'desktop': {	
			/**
			 * Desktop primär
			 */
			'arialabel': () => LocalizedString
			'routes': {	
				/**
				 * Startseite
				 */
				'homepage': () => LocalizedString
				/**
				 * Speisen
				 */
				'food': () => LocalizedString
				/**
				 * Getränke
				 */
				'drinks': () => LocalizedString
			}
		}
		'mobile': {	
			/**
			 * Mobil primär
			 */
			'arialabel': () => LocalizedString
			'routes': {	
				/**
				 * Startseite
				 */
				'homepage': () => LocalizedString
				/**
				 * Essen
				 */
				'food': () => LocalizedString
				/**
				 * Getränke
				 */
				'drinks': () => LocalizedString
				/**
				 * Profil
				 */
				'account': () => LocalizedString
				/**
				 * Warenkorb
				 */
				'cart': () => LocalizedString
			}
		}
	}
	'cart': {	
		/**
		 * Warenkorb
		 */
		'cart': () => LocalizedString
		/**
		 * Anmerkungen
		 */
		'remarks': () => LocalizedString
		/**
		 * Anzahl
		 */
		'qty': () => LocalizedString
	}
	'customer': {	
		/**
		 * Konto
		 */
		'account': () => LocalizedString
		/**
		 * Sprache
		 */
		'language': () => LocalizedString
		/**
		 * Einstellungen
		 */
		'settings': () => LocalizedString
		/**
		 * Einloggen
		 */
		'login': () => LocalizedString
		/**
		 * Registrieren
		 */
		'signUp': () => LocalizedString
		/**
		 * Abmelden
		 */
		'logout': () => LocalizedString
		/**
		 * Zahlungsmethoden
		 */
		'paymentMethods': () => LocalizedString
		'profile': {	
			/**
			 * Sprache auswählen
			 */
			'select-language': () => LocalizedString
		}
	}
	'footer': {	
		/**
		 * Über {shopname}
		 */
		'about': (arg: { shopname: string }) => LocalizedString
		/**
		 * Lieferzeiten
		 */
		'deliverytimes': () => LocalizedString
	}
}

export type Formatters = {}

type Param<P extends string> = `{${P}}`

type Params1<P1 extends string> =
	`${string}${Param<P1>}${string}`

type RequiredParams1<P1 extends string> =
	| Params1<P1>
