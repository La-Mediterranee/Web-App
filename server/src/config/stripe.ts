import Stripe from 'stripe';
import { config } from 'dotenv';
import { NODE_ENV, PORT, STRIPE_SECRET } from '@consts';

if (NODE_ENV !== 'production') {
	config();
}

export const stripe = new Stripe(STRIPE_SECRET, {
	apiVersion: '2020-08-27'
});

import { app } from '../api';
const port = PORT || 3333;
app.listen(port, () => console.log(`Listening http://localhost${port}`));
