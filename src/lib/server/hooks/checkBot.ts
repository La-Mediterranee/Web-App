import type { Handle } from '@sveltejs/kit';

export const checkBot: Handle = ({ event, resolve }) => {
	const ua = event.request.headers.get('user-agent')!;
	if (/^(facebookexternalhit)|(twitterbot)|(Twitterbot)|(Pinterest)|(LinkedInBot)/gi.test(ua)) {
		console.log(ua, ' is a bot');
	}

	return resolve(event);
};
