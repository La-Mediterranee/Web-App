import type { RequestHandlerOutput } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit/types';

export async function GET({ params }: RequestEvent): Promise<RequestHandlerOutput> {
	return {
		headers: new Headers({
			'content-type': 'application/xml',
		}),
	};
}
