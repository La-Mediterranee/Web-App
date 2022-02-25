import type { EndpointOutput, RequestEvent } from '@sveltejs/kit/types/internal';

// export async function get() {}

export async function post(event: RequestEvent): Promise<EndpointOutput> {
	const form = await event.request.formData();

	for (const entry of form.entries()) {
		console.log(entry);
	}

	return {
		status: 303,
		headers: {
			location: `./checkout`,
		},
	};
}
