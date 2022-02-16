import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

export function get(event: RequestEvent): EndpointOutput {
	return {
		body: {
			categories: [
				'burger',
				'sandwiches',
				'fish',
				'burger',
				'sandwiches',
				'fish',
				'burger',
				'sandwiches',
				'fish',
				'burger',
				'sandwiches',
				'fish',
			],
		},
	};
}
