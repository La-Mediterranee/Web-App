import { goto } from '$app/navigation';

export interface FormEnhance {
	pending?: (data: FormData, form: HTMLFormElement) => void;
	error?: (res: Response | null, error: Error | null, form: HTMLFormElement) => void;
	result: (res: Response, form: HTMLFormElement) => void;
}

export function enhance(form: HTMLFormElement, { pending, error, result }: FormEnhance) {
	let current_token: {};

	async function handle_submit(e: Event) {
		const token = (current_token = {});

		e.preventDefault();

		const elements = Array.from(form.elements) as HTMLInputElement[];

		const body = new FormData(form);
		console.log(body);

		if (pending) pending(body, form);

		console.log(form.action);

		try {
			const res = await fetch(form.action, {
				method: form.method,
				// headers: {
				// 	accept: 'application/json',
				// },
				body,
			});

			if (token !== current_token) return;

			if (res.ok) {
				result(res, form);
			} else if (error) {
				error(res, null, form);
			} else {
				console.error(await res.text());
			}
		} catch (_e) {
			if (error) {
				error(null, _e as Error, form);
			} else {
				throw e;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		},
	};
}
