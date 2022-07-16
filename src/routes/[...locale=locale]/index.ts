import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit/types';

export async function GET(event: RequestEvent): Promise<RequestHandlerOutput> {
	return {
		// headers: {
		// 	'content-type': 'text/html',
		// },
		// body: `
		// 	<!DOCTYPE html>
		// 	<html>
		// 		<head>
		// 			<meta name="twitter:card" content="summary" />
		// 			<meta name="twitter:site" content="@your_account" />
		// 			<meta name="twitter:creator" content="@your_account" />
		// 		</head>
		// 	</html>
		// `,
	};
}
