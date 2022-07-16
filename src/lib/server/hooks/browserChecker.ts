import type { Handle } from '@sveltejs/kit';

export const browserChecker: Handle = async ({ resolve, event }) => {
	const unSupportedBrowsers = ['MSIE.*', 'Trident.*'];

	// check for unsupported browsers
	if (
		/MSIE \d|Trident.*rv:/.test(event.request.headers.get('user-agent') || '') &&
		!event.url.pathname.includes('unsupported')
	) {
		return new Response(null, {
			status: 301,
			headers: {
				location: `/unsupported`,
			},
		});
	}

	const response = await resolve(event);

	return response;
};
