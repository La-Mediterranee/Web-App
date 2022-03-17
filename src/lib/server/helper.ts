import { auth } from './firebase';
import { serialize } from './cookie';

import type { Options } from './cookie';
import type {
	ResponseHeaders,
	ShadowEndpointOutput,
	RequestHandlerOutput,
} from '@sveltejs/kit/types/internal';
import { SERVER_URL } from './constants';

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

export function clearCookie(
	response: ShadowEndpointOutput | Response,
	name: string,
	options: Record<string, any> = {},
) {
	const opt = Object.assign({ expires: new Date(1), path: '/' }, options);
	setCookie(response, name, '', opt);
}

const COOKIE_HEADER = 'set-cookie';

export function setCookie(
	response: ShadowEndpointOutput | Response,
	name: string,
	value: string,
	options: Options = {},
) {
	const cookie = serialize(name, value, options);

	if (response.headers instanceof Headers) {
		return response.headers.append(COOKIE_HEADER, cookie);
	}

	if (response.headers != null) {
		const headers = (response as ShadowEndpointOutput).headers as Partial<ResponseHeaders>;
		const currentCookies = headers[COOKIE_HEADER] as string | string[] | undefined;

		headers[COOKIE_HEADER] = currentCookies
			? Array.isArray(currentCookies)
				? currentCookies.push(cookie)
				: [cookie, currentCookies]
			: cookie;
	}

	(response as ShadowEndpointOutput).headers = {
		'set-cookie': cookie,
	};
}

export async function refreshSessionCookie(response: Response, uid: string) {
	const days = 14;
	const expiresIn = days * 60 * 60 * 24 * 1000;

	const res = await fetch(`${SERVER_URL}/v1/auth/session/extend`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			uid,
			expiresIn,
		}),
	});

	if (!res.ok) {
		const msg = await res.json();
		throw new Error((msg as Error).message);
	}

	const cookie = await res.json();

	setCookie(response, 'sessionId', cookie, {
		maxAge: expiresIn / 1000,
		httpOnly: true,
		secure: true,
		path: '/',
		// domain: ".",
	});

	return cookie;
}

// class InvalidTokenError extends Error {
// 	constructor(readonly message: string) {
// 		super();
// 	}
// }

// interface FirebaseHeader {
// 	alg: 'RS256';
// 	kid: string;
// }

// interface DecodedFirebaseToken {
// 	header: FirebaseHeader;
// 	payload: DecodedIdToken;
// 	signature: string;
// }

// function createDecoder() {
// 	const decoder = dev
// 		? (raw: string) => Buffer.from(raw, 'base64').toString()
// 		: (raw: string) => {
// 				raw = <JwtToken>raw.replace(/-/g, '+').replace(/_/g, '/');
// 				switch (raw.length % 4) {
// 					case 0:
// 						break;
// 					case 2:
// 						raw += '==';
// 						break;
// 					case 3:
// 						raw += '=';
// 						break;
// 					default:
// 						throw new Error('Illegal base64url string!');
// 				}

// 				return decodeURIComponent(escape(self.atob(raw)));
// 		  };

// 	return function decodeJWT(raw: JwtToken): DecodedFirebaseToken {
// 		const [header, payload, signature] = raw.split('.');

// 		try {
// 			return <DecodedFirebaseToken>{
// 				header: JSON.parse(decoder(header)),
// 				payload: JSON.parse(decoder(payload)),
// 				signature,
// 			};
// 		} catch (e) {
// 			throw new InvalidTokenError('Invalid token specified: ' + (e as any).message);
// 		}
// 	};
// }

// const jwtDecoder = createDecoder();

// async function verifySessionCookie(token: JwtToken) {
// 	if (typeof token !== 'string') {
// 		// throw new FirebaseAuthError(
// 		// 	AuthClientErrorCode.INVALID_ARGUMENT,
// 		// 	`First argument to ${this.tokenInfo.verifyApiName} must be a ${this.tokenInfo.jwtName} string.`,
// 		// );
// 	}

// 	// const decodedIdToken = jwt_decode<DecodedIdToken>(token, { header: true });
// 	const decodedToken = jwtDecoder(token);

// 	verifyFirebaseToken(decodedToken);

// 	const decodedIdToken = decodedToken.payload;
// 	console.log('JWT:', decodedIdToken);

// 	decodedIdToken.uid = decodedIdToken.sub;
// 	return decodedIdToken;
// }

// const PROJECT_ID = 'la-meditaterranee';
// const ALGORITHM_RS256 = 'RS256';
// const APP_CHECK_ISSUER = 'https://firebaseappcheck.googleapis.com/';

// async function verifyFirebaseToken({ header, payload }: DecodedFirebaseToken) {
// 	const projectIdMatchMessage =
// 		' Make sure the token comes from the same ' +
// 		'Firebase project as the service account used to authenticate this SDK.';
// 	const scopedProjectId = `projects/${PROJECT_ID}`;

// 	// let errorMessage: string | undefined;
// 	// if (header.alg !== ALGORITHM_RS256) {
// 	//   errorMessage = `The provided App Check token has incorrect algorithm. Expected "${ALGORITHM_RS256}" but got "${header.alg}".`;

// 	let errorMessage: string | undefined;
//     if (!isEmulator && typeof header.kid === 'undefined') {
//       const isCustomToken = (payload.aud === FIREBASE_AUDIENCE);
//       const isLegacyCustomToken = (header.alg === 'HS256' && payload.v === 0 && 'd' in payload && 'uid' in payload.d);

//       if (isCustomToken) {
//         errorMessage = `${this.tokenInfo.verifyApiName} expects ${this.shortNameArticle} ` +
//           `${this.tokenInfo.shortName}, but was given a custom token.`;
//       } else if (isLegacyCustomToken) {
//         errorMessage = `${this.tokenInfo.verifyApiName} expects ${this.shortNameArticle} ` +
//           `${this.tokenInfo.shortName}, but was given a legacy custom token.`;
//       } else {
//         errorMessage = 'Firebase ID token has no "kid" claim.';
//       }

//       errorMessage += verifyJwtTokenDocsMessage;
//     } else if (header.alg !== ALGORITHM_RS256) {
//       errorMessage = `${this.tokenInfo.jwtName} has incorrect algorithm. Expected "` + ALGORITHM_RS256 + '" but got ' +
//         '"' + header.alg + '".' + verifyJwtTokenDocsMessage;
//     } else if (payload.aud !== projectId) {
//       errorMessage = `${this.tokenInfo.jwtName} has incorrect "aud" (audience) claim. Expected "` +
//         projectId + '" but got "' + payload.aud + '".' + projectIdMatchMessage +
//         verifyJwtTokenDocsMessage;
//     } else if (payload.iss !== this.issuer + projectId) {
//       errorMessage = `${this.tokenInfo.jwtName} has incorrect "iss" (issuer) claim. Expected ` +
//         `"${this.issuer}` + projectId + '" but got "' +
//         payload.iss + '".' + projectIdMatchMessage + verifyJwtTokenDocsMessage;
//     } else if (typeof payload.sub !== 'string') {
//       errorMessage = `${this.tokenInfo.jwtName} has no "sub" (subject) claim.` + verifyJwtTokenDocsMessage;
//     } else if (payload.sub === '') {
//       errorMessage = `${this.tokenInfo.jwtName} has an empty string "sub" (subject) claim.` + verifyJwtTokenDocsMessage;
//     } else if (payload.sub.length > 128) {
//       errorMessage = `${this.tokenInfo.jwtName} has "sub" (subject) claim longer than 128 characters.` +
//         verifyJwtTokenDocsMessage;
//     }
//     if (errorMessage) {
//       throw new FirebaseAuthError(AuthClientErrorCode.INVALID_ARGUMENT, errorMessage);
//     }
// }
