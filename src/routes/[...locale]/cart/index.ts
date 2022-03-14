import type { RequestEvent, ShadowEndpointOutput } from '@sveltejs/kit/types/internal';

export async function get() {
	return {};
}

export async function post(event: RequestEvent): Promise<ShadowEndpointOutput> {
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
