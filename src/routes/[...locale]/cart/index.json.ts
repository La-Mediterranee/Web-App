import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

export async function get() {}

export async function post(event: RequestEvent) {
	const form = await event.request.formData();
	console.log(form);
}
