import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export async function get({
	locals,
}: ServerRequest<Record<string, any>, unknown>): Promise<EndpointOutput> {
	console.log(locals);

	return {
		status: 302,
		headers: {
			Location: `${locals}/404`,
		},
	};
}
