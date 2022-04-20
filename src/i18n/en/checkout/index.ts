import type { NamespaceCheckoutTranslation } from '../../i18n-types';

const en_checkout: NamespaceCheckoutTranslation = {
	deliveryDetails: {
		title: 'Delivery Details',
		userInfo: {
			title: 'Contact info',
			email: 'E-Mail',
			phone: 'Phone number',
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
				cardNumber: 'Card number',
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

export default en_checkout;
