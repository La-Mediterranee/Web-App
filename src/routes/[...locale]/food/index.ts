import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/helper';

export async function get(event: RequestEvent): Promise<EndpointOutput> {
	return {
		body: <JSONObject>{
			categories: ['burger', 'sandwiches', 'fish', 'fries'],
		},
	};
}
