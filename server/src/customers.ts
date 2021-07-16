import Stripe from 'stripe';
import { db, stripe } from './config';

export async function getOrCreateCustomer(
	customerId: string,
	params?: Stripe.CustomerCreateParams
) {
	const userSnapshot = await db.collection('users').doc(customerId).get();

	const { email, stripeCustomerId } = userSnapshot.data();

	if (!stripeCustomerId) {
		const customer = await stripe.customers.create({
			email,
			metadata: {
				firebaseUID: customerId
			},
			...params
		});

		await userSnapshot.ref.update({ stripCustomerId: customer.id });

		return customer;
	}

	return (await stripe.customers.retrieve(stripeCustomerId)) as Stripe.Customer;
}

/**
 * Creates a SetupIntent used to save a credit card for later use
 */
export async function createSetupIntent(customerId: string) {
	const customer = await getOrCreateCustomer(customerId);

	return stripe.setupIntents.create({
		customer: customer.id
	});
}

/**
 * Returns all payment sources associated to the user
 */
export async function listPaymentMethods(userId: string) {
	const customer = await getOrCreateCustomer(userId);

	return stripe.paymentMethods.list({
		customer: customer.id,
		type: 'card'
	});
}
