import cors from 'cors';
import express from 'express';
import { createCheckoutSession } from './checkout';
import { createPaymentIntent } from './payments';
import { auth } from './config';
// Types
import type Stripe from 'stripe';
import { handleStripeWebhook } from './webhooks';
import { createSetupIntent, listPaymentMethods } from './customers';

interface Body {
	line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
}

export const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
// Decodes the Firebase JSON Web Token
app.use(decodeJWT);
app.use(
	express.json({
		verify: (req, res, buffer, encoding) => (req['rawBody'] = buffer)
	})
);
/**
 * Serverside Checkout
 */
app.post(
	'/checkout',
	runAsync(async ({ body }: express.Request<{}, {}, Body>, res: express.Response) => {
		res.send(await createCheckoutSession(body.line_items));
	})
);
/**
 * Payment Intents
 */
app.post(
	'/payments',
	runAsync(async ({ body }: express.Request, res: express.Response) => {
		res.send(await createPaymentIntent(body.amount));
	})
);
/**
 * Stripe Webhooks
 */
app.post('/hooks', runAsync(handleStripeWebhook));

/**
 * Save customer paymentmethod
 */
app.post(
	'wallet',
	runAsync(async (req: express.Request, res: express.Response) => {
		// const user = validateUser(req);
		const customer = validateUser(req);
		const setupIntent = await createSetupIntent(customer.uid);
		res.send(setupIntent);
	})
);
/**
 * Retrieve all paymentmethods attached to customer
 */
app.get(
	'wallet',
	runAsync(async (req: express.Request, res: express.Response) => {
		const customer = validateUser(req);
		const wallet = await listPaymentMethods(customer.uid);
		res.send(wallet.data);
	})
);

// Service Worker Notifications
// const publicVapidKey = 'Public Vapid Key';
// const privateVapidKey = 'Private Vapid Key';

// webpush.setVapidDetails('mailto:someEmail@emailSite.com', publicVapidKey, privateVapidKey);

// app.post('/subscribe', jsonParser, async function (req, res) {
// 	try {
// 		let hash = objectHash(req.body);
// 		let subscription = req.body;
// 		let checkSubscription = await Subscription.Subscription.find({ hash: hash });

// 		let theMessage = JSON.stringify({
// 			title: 'You have already subscribed',
// 			body: 'Some body text here.'
// 		});
// 		if (checkSubscription.length == 0) {
// 			const newSubscription = new Subscription.Subscription({
// 				hash: hash,
// 				subscriptionEl: subscription
// 			});
// 			newSubscription.save(function (err) {
// 				if (err) {
// 					theMessage = JSON.stringify({
// 						title: 'We ran into an error',
// 						body: 'Please try again later'
// 					});
// 					webpush.sendNotification(subscription, payload).catch(function (error) {
// 						console.error(error.stack);
// 					});
// 					res.status(400);
// 				} else {
// 					theMessage = JSON.stringify({
// 						title: 'Thank you for Subscribing!',
// 						body: 'Some body text here'
// 					});
// 					webpush.sendNotification(subscription, payload).catch(function (error) {
// 						console.error(error.stack);
// 					});
// 					res.status(201);
// 				}
// 			});
// 		} else {
// 			webpush.sendNotification(subscription, theMessage).catch(function (error) {
// 				console.error(error.stack);
// 			});
// 			res.status(400);
// 		}
// 	} catch (e) {
// 		console.log(e);
// 	}
// });

// const sendNotifications = async function () {
// 	const allSubscriptions = await Subscription.Subscription.find();

// 	allSubscriptions.forEach(function (item) {
// 		let ourMessage = JSON.stringify({
// 			title: req.body.titles[0].title,
// 			body: req.body.description
// 		});
// 		webpush.sendNotification(item.subscriptionEl, ourMessage).catch(function (error) {
// 			console.error(error.stack);
// 		});
// 	});
// };

function runAsync(cb: Function) {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		cb(req, res, next).catch(next);
	};
}
/**
 * Decodes the JSON Web Token sent via the frontend app.
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeJWT(req: express.Request, res: express.Response, next: express.NextFunction) {
	if (req.headers?.authorization?.startsWith('Bearer ')) {
		const idToken = req.headers.authorization.split('Bearer ')[1];

		try {
			const decodedToken = await auth.verifyIdToken(idToken);
			req['currentUser'] = decodedToken;
		} catch (err) {
			console.log(err);
		}
	}

	next();
}

/**
 * Throws an error if the currentUser does not exist on the request
 */
function validateUser(req: express.Request) {
	const user = req['currentUser'];
	if (!user) {
		throw new Error(
			'You must be logged in to make this request. i.e Authroization: Bearer <token>'
		);
	}

	return user;
}
