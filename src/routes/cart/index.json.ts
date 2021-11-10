import type { EndpointOutput, Request } from '@sveltejs/kit';

type GetRequest<Locals = Record<string, any>, Input = unknown> = Request<Locals, Input>;
export async function get() {}

type PostRequest<Locals = Record<string, any>> = Request<Locals, FormData>;
export async function post(request: PostRequest) {
	console.log(request.body);

	request.body.get('');
}
