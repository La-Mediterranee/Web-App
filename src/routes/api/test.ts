import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

export async function get({ locals }: RequestEvent): Promise<EndpointOutput> {
	return {
		status: 302,
		headers: {
			Location: `${locals}/404`,
		},
	};
}
