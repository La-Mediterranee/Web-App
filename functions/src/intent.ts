import Stripe from 'stripe';
import { stripe } from './config';

const CURRENCY = 'eur';

async function createIntent(amount: number) {
	const params: Stripe.PaymentIntentCreateParams = {
		payment_method_types: ['card'],
		amount: Math.round(amount * 100),
		currency: CURRENCY
	};

	await stripe.paymentIntents.create(params);
}

function formatAmountForStripe(amount: number, currency: typeof CURRENCY) {
	const numberFormat = new Intl.NumberFormat(['de-AT'], {
		style: 'currency',
		currency: currency,
		currencyDisplay: 'symbol'
	});
	const parts = numberFormat.formatToParts(amount);

	let zeroDecimalCurrency: boolean = true;
	for (let part of parts) {
		if (part.type === 'decimal') {
			zeroDecimalCurrency = false;
		}
	}

	return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
