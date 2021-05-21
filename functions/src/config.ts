import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const db = admin.firestore();
const settings: FirebaseFirestore.Settings = { timestampInSnapshots: true };

db.settings(settings);

export const stripeSecret: string = functions?.config().stripe?.secret;

import Stripe from 'stripe';
export const stripe = new Stripe(stripeSecret, {
	apiVersion: '2020-08-27'
});
