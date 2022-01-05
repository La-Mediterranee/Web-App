import { auth } from './firebase';

/**
 * Decodes the JSON Web Token sent via the frontend app.
 * Makes the currentUser (firebase) data available on the body.
 */
export async function decodeJWT(authorization: string) {
	if (!authorization.startsWith('Bearer ')) return;

	try {
		const idToken = authorization.split('Bearer ')[1];
		return auth.verifyIdToken(idToken);
	} catch (err) {
		console.error(err);
	}
}
