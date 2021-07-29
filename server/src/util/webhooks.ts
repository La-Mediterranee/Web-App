import { stripe } from '../config';
import { STRIPE_WEBHOOK_SECRET } from '@util/consts';
// Types
import type Express from 'express';
import type Stripe from 'stripe';

/**
 * Business logic for specific webhook event types
 */
const webhookHandlers = {
	'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
		// Add your business logic here
	},
	'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
		// Add your business logic here
	}
};

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
export async function handleStripeWebhook(req: Express.Request, res) {
	const sig = req.headers['stripe-signature'] as string;
	const event = stripe.webhooks.constructEvent(req['rawBody'], sig, STRIPE_WEBHOOK_SECRET);

	try {
		await webhookHandlers[event.type](event.data.object);
		res.send({ received: true });
	} catch (err) {
		console.error(err);
		res.status(400).send(`Webhook Error: ${err.message}`);
	}
}
