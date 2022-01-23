import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

type GetRequest<Locals = Record<string, any>> = RequestEvent<Locals>;
export async function get() {}

type PostRequest<Locals = Record<string, any>> = RequestEvent<Locals>;
export async function post(event: PostRequest) {
	const form = await event.request.formData();
	console.log(form);
}
