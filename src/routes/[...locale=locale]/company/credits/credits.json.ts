import type { RequestHandlerOutput } from '@sveltejs/kit/types';

const credits = {
	posts: {
		firebase: [
			'https://miyauchi.dev/posts/fcm-push-message/',
			'https://miyauchi.dev/posts/firebase-authentication-service-worker/',
		],
		others: [
			'https://css-tricks.com/a-super-flexible-css-carousel-enhanced-with-javascript-navigation/',
		],
	},
	projects: [
		{
			name: 'bagisto',
			url: 'https://bagisto.com',
			for: [
				`some of the arabic translations. 
				Reason: because I was to lazy to write them all because 
				I am so slow at writing arabic with a keyboard`,
			],
		},
	],
	websites: ['lacoste.at', 'mjam.at', 'netflix.com', 'mediamarkt.at'],
	// bagisto: {
	// 	url: 'https://bagisto.com',
	// 	for: [
	// 		`some of the arabic translations.
	// 		Reason: because I was to lazy to write them all because
	// 		I am so slow at writing arabic with a keyboard`,
	// 	],
	// },
};

export function GET(): RequestHandlerOutput {
	return {
		body: credits,
	};
}
