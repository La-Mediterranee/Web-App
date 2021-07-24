import { getContext } from 'svelte';
import { StripeContext } from 'types/index';

const API = 'http://localhost:3333';

export async function fetchFromAPI(endpointURL: string, opt?: Object) {
	const { method, body, ...rest } = {
		method: 'POST',
		body: null as Object | null,
		...opt
	};

	// const customer = auth.currentUser;
	// const token = customer && (await customer.getIdToken());

	const res = await fetch(`${API}/${endpointURL}`, {
		method,
		...(body && { body: JSON.stringify(body) }),
		headers: {
			'Content-Type': 'application/json'
			// Authorization: `Bearer ${token}`,
		}
	});

	return res.json();
}

export function getStripeContext() {
	return getContext<StripeContext>('stripe')?.getStripe();
}
