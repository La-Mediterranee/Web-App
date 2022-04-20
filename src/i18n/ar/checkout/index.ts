import type { NamespaceCheckoutTranslation } from '../../i18n-types';

const ar_checkout: NamespaceCheckoutTranslation = {
	deliveryDetails: {
		title: 'Delivery Details',
		userInfo: {
			title: 'Contact info',
			email: 'E-Mail',
			phone: 'Phonenumber',
			name: 'Name',
			surname: 'Surname',
		},
		deliveryInfo: {
			title: 'Address',
			street: 'Street', //Straße und Hausnummer
			city: 'City',
			postalCode: 'PLZ',
		},
		next: 'To Payment Details',
	},
	paymentDetails: {
		title: 'Payment Details',
		tip: {
			title: 'Tip',
			customTip: 'Custom Tip',
		},
		payment: {
			title: 'Payment Method',
			creditCard: {
				title: 'Credit Card',
				cardNumber: 'Card Number',
				expiration: 'Expiration',
				cvc: 'CVC',
			},
			sofort: 'Sofort Überweisung',
			cash: 'Cash',
		},
		prev: 'To Delivery Details',
		next: 'To Summary',
	},
	summary: {
		title: 'Summary',
		prev: 'To Payment Details',
		next: 'Finish',
	},
};

export default ar_checkout;
