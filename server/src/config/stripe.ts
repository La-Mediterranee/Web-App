import Stripe from 'stripe';
import { STRIPE_SECRET } from '@util/consts';

// if (NODE_ENV !== 'production') {
// 	config();
// }

export const stripe = new Stripe(STRIPE_SECRET, {
	apiVersion: '2020-08-27'
});
