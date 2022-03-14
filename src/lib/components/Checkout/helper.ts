import type {
	Stripe,
	StripeCardElement,
	StripeCardNumberElement,
	PaymentMethodCreateParams,
	PaymentRequestShippingOption,
} from '@stripe/stripe-js';

interface FormInput {
	name: string;
	email: string;
	address: PaymentMethodCreateParams.BillingDetails.Address;
	phone: string;
}

async function submitOrder(order: any) {}

export function createPaymentRequest(
	stripe: Stripe,
	amount: number,
	label: string = 'Bestellung',
	shipping?: PaymentRequestShippingOption[],
) {
	const paymentRequest = stripe.paymentRequest({
		country: 'AT',
		currency: 'eur',
		total: { label, amount },
		requestPayerName: true,
		requestPayerEmail: true,
		requestPayerPhone: true,
		requestShipping: shipping && true,
		shippingOptions: shipping,
	});

	return paymentRequest;
}

export async function createCardPayment(
	stripe: Stripe,
	cardElement: StripeCardElement | StripeCardNumberElement,
	form: FormInput,
) {
	const { error: backendError, clientSecret } = await getClientSecret('card');

	if (backendError) {
		console.error(backendError.message);
		return;
	}

	stripe.confirmCardPayment(clientSecret, {
		receipt_email: form.email,
		payment_method: {
			card: cardElement,
			billing_details: {
				name: form.name,
				email: form.email,
				address: form.address,
				phone: form.phone,
			},
		},
	});
}

export async function createSofortPayment(stripe: Stripe, form: FormInput) {
	const { error: backendError, clientSecret } = await getClientSecret('sofort');

	if (backendError) {
		console.error(backendError.message);
		return;
	}

	const { error, paymentIntent } = await stripe.confirmSofortPayment(clientSecret, {
		payment_method: {
			sofort: {
				country: 'AT',
			},
			billing_details: {
				name: form.name,
				email: form.email,
				address: form.address,
				phone: form.phone,
			},
		},
		// Return URL where the customer should be redirected after the authorization.
		return_url: window.location.href,
	});
}

export async function createOnDeliveryPayment(form: FormInput) {
	fetch('/buy/create-payment-delivery', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			currency: 'eur',
		}),
	});
}

async function getClientSecret(paymentMethod: string) {
	// Make a call to the server to create a new
	// payment intent and store its client_secret.
	return await fetch('/buy/create-payment-intent', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			currency: 'eur',
			paymentMethodType: paymentMethod,
		}),
	}).then(r => r.json());
}
