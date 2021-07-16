import { stripe } from './config';
import type Stripe from 'stripe';

/**
 * Create a Payment Intent with a specific amount
 */
export async function createPaymentIntent(
	amount: number
): Promise<Stripe.Response<Stripe.PaymentIntent>> {
	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency: 'eur'
		// receipt_email: 'hello@fireship.io',
	});

	// paymentIntent.status;

	return paymentIntent;
}
