// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType } from 'typesafe-i18n'
import type { LocalizedString } from 'typesafe-i18n'

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
	'nav': {	
		/**
		 * Einloggen
		 */
		'login': string
		'desktop': {	
			/**
			 * desktop primär
			 */
			'arialabel': string
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
		}
		'mobile': {	
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
			'profile': string
			/**
			 * Warenkorb
			 */
			'cart': string
		}
	}
	'footer': {	
		/**
		 * Über {shopname}
		 * @param {unknown} shopname
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
	'nav': {	
		/**
		 * Einloggen
		 */
		'login': () => LocalizedString
		'desktop': {	
			/**
			 * desktop primär
			 */
			'arialabel': () => LocalizedString
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
		}
		'mobile': {	
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
			'profile': () => LocalizedString
			/**
			 * Warenkorb
			 */
			'cart': () => LocalizedString
		}
	}
	'footer': {	
		/**
		 * Über {shopname}
		 */
		'about': (arg: { shopname: unknown }) => LocalizedString
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