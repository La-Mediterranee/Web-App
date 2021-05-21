import { stripe } from './config';

const DOMAIN = '';
async function createCheckoutSession() {
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price_data: {
					currency: 'eur',
					product_data: {
						name: 'Stubborn Attachments'
					},
					unit_amount: 2000
				},
				quantity: 1
			}
		],
		shipping_address_collection: {
			allowed_countries: ['AT']
		},
		billing_address_collection: 'auto',
		mode: 'payment',
		success_url: `${DOMAIN}/success.html`,
		cancel_url: `${DOMAIN}/cancel.html`
	});
}
