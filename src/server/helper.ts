import { auth } from './firebase';

import type { Request } from '@sveltejs/kit';

/**
 * Decodes the JSON Web Token sent via the frontend app.
 * Makes the currentUser (firebase) data available on the body.
 */
export async function decodeJWT(req: Request) {
	if (req.headers?.authorization?.startsWith('Bearer ')) {
		const idToken = req.headers.authorization.split('Bearer ')[1];
		try {
			const decodedToken = await auth.verifyIdToken(idToken);
			req.locals.user = decodedToken;
		} catch (err) {
			console.error(err);
		}
	}
}
