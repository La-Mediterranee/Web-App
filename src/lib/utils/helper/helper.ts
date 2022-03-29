import { SERVER_URL } from '$lib/utils/constants';

export async function fetchFromAPI(endpointURL: string, opt: RequestInit = {}) {
	const {
		method = 'POST',
		headers = {
			'Content-Type': 'application/json',
		},
		...rest
	} = opt;

	// const customer = auth.currentUser;
	// const token = customer && (await customer.getIdToken());

	const res = await fetch(`${SERVER_URL}/v1${endpointURL}`, {
		method,
		headers,
		...rest,
	});

	return res;
}

export function promiseEvent<T>(
	emitter: Element | Window,
	eventName: string,
	timeout: number,
): Promise<T> {
	return new Promise((resolve, reject) => {
		let timer: number;

		function listener(data: any) {
			clearTimeout(timer);
			emitter.removeEventListener(eventName, listener);
			resolve(data);
		}

		emitter.addEventListener(eventName, listener);
		timer = window.setTimeout(() => {
			emitter.removeEventListener(eventName, listener);
			reject(new Error('timeout waiting for ' + eventName));
		}, timeout);
	});
}

export async function runAsync<T>(promise: Promise<T>): Promise<[T | null, any | null]> {
	try {
		const data = await promise;
		return [data, null];
	} catch (error) {
		console.error(error);
		return [null, error];
	}
}

function getDayNames(locale = 'de', format: Intl.DateTimeFormatOptions['weekday'] = 'long') {
	const formatter = new Intl.DateTimeFormat(locale, {
		weekday: format,
		timeZone: 'UTC',
	});

	const days = [1, 2, 3, 4, 5, 6, 7].map(day => new Date(`2017-01-0${day}T00:00:00+00:00`));

	return days.map(date => formatter.format(date));
}
