import Stripe from 'stripe';
import { stripe } from './config';
import { WEB_URL } from './util/consts';

export async function createCheckoutSession(
	line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
	const url = WEB_URL;

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card', 'sofort', 'eps'],
		line_items,
		mode: 'payment',
		cancel_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
		success_url: `${url}/failed`
	});

	return session;
}
