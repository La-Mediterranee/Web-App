import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit/types/internal';

// import Stripe from 'stripe';

// const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_API);
// const secret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;

export async function get({ locals }: RequestEvent): Promise<RequestHandlerOutput> {
	return {
		status: 302,
		headers: {
			Location: `${locals}/404`,
		},
	};
}

// export async function post({ request }: RequestEvent): Promise<EndpointOutput> {
// 	try {
// 		// const clone = request.clone();
// 		// const text = await clone.text();
// 		const body = await request.text();
// 		// const body = await request.buffer();
// 		// console.log(body.length);
// 		// console.log(text.length);
// 		// console.log(Buffer.from(text).length);
// 		const sig = request.headers.get('stripe-signature') as string;
// 		const e = stripe.webhooks.constructEvent(body, sig, secret);
// 		console.log(e.type);
// 	} catch (_e) {
// 		console.error(_e);
// 	}

// 	return {
// 		status: 200,
// 	};
// }
