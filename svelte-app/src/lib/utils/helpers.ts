const API = 'http://localhost:3333';

export async function fetchFromAPI(endpointURL: string, opt?: Object) {
	const { method = 'POST', body = null } = { method: 'POST', body: null, ...opt };

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
