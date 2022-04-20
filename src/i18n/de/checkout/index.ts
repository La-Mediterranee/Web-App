import type { BaseTranslation } from '../../i18n-types';

const de_checkout: BaseTranslation = {
	deliveryDetails: {
		title: 'Lieferdetails',
		userInfo: {
			title: 'Kontaktinformation',
			email: 'E-Mail',
			phone: 'Telefonnummer',
			name: 'Vorname',
			surname: 'Familienname',
		},
		deliveryInfo: {
			title: 'Lieferadresse',
			street: 'Adresse', //Straße und Hausnummer
			city: 'Stadt',
			postalCode: 'PLZ',
		},
		next: 'Zur Zahlung',
	},
	paymentDetails: {
		title: 'Zahlungsdetails',
		tip: {
			title: 'Trinkgeld',
			customTip: 'Benutzerdefiniertes Trinkgeld',
		},
		payment: {
			title: 'Zahlungsmethode',
			creditCard: {
				title: 'Kreditkarte',
				cardNumber: 'Kartennummer',
				expiration: 'Gültig bis',
				cvc: 'Prüfzahl/CVC',
			},
			sofort: 'Sofort Überweisung',
			cash: 'Barzahlung',
		},
		prev: 'Zurück zu Lieferdetails',
		next: 'Zur Zusammenfassung',
	},
	summary: {
		title: 'Zusammenfassung',
		prev: 'Zurück zu Zahlungsdetails',
		next: 'Bestellung bestätigen',
	},
};

export default de_checkout;
