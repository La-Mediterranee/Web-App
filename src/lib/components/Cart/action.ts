import { goto } from '$app/navigation';

export function enhance(
	form: HTMLFormElement,
	{
		pending,
		error,
		result,
	}: {
		pending?: (data: FormData, form: HTMLFormElement) => void;
		error?: (
			res: Response | null,
			error: Error | null,
			form: HTMLFormElement
		) => void;
		result: (res: Response, form: HTMLFormElement) => void;
	}
) {
	let current_token: {};

	async function handle_submit(e: Event) {
		const token = (current_token = {});

		e.preventDefault();

		const elements = Array.from(form.elements) as HTMLInputElement[];

		elements.forEach((e) => {
			console.log(e.value);
		});

		const body = new FormData(form);
		console.log(body.values());

		goto('/checkout');

		return;

		// if (pending) pending(body, form);

		// try {
		// 	const res = await fetch(form.action, {
		// 		method: form.method,
		// 		headers: {
		// 			accept: 'application/json'
		// 		},
		// 		body
		// 	});

		// 	if (token !== current_token) return;

		// 	if (res.ok) {
		// 		result(res, form);
		// 	} else if (error) {
		// 		error(res, null, form);
		// 	} else {
		// 		console.error(await res.text());
		// 	}
		// } catch (e) {
		// 	if (error) {
		// 		error(null, e, form);
		// 	} else {
		// 		throw e;
		// 	}
		// }
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		},
	};
}
