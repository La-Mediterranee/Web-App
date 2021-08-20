import {
	signInWithPopup,
	signInWithEmailAndPassword,
	signInWithCustomToken,
	updateProfile,
	updateEmail,
	OAuthProvider,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
	TwitterAuthProvider,
	getAdditionalUserInfo,
} from 'firebase/auth';

import type { Auth, UserCredential } from 'firebase/auth';

interface AuthError {
	code: string;
	message: string;
}

interface OAuthUser {
	token: string;
	email: string;
	displayName: string;
	photoURL: string;
}

export async function signIn(auth: Auth, email: string, password: string) {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		return { user, newUser: false };
	} catch (err: unknown) {
		const errorCode = (err as AuthError).code;
		const errorMessage = (err as AuthError).message;
		console.error(errorCode);
		console.error(errorMessage);
	}
}

export async function signInWithGoogle(auth: Auth) {
	const provider = new GoogleAuthProvider();

	try {
		const userCredential = await signInWithPopup(auth, provider);
		const info = getAdditionalUserInfo(userCredential);
		const user = userCredential.user;

		return { user, newUser: info?.isNewUser };
	} catch (error) {
		// // The AuthCredential type that was used.
		// const credential = GoogleAuthProvider.credentialFromError(error);
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(errorCode);
		console.error(errorMessage);
	}
}
export async function signInWithFacebook(auth: Auth) {
	const provider = new FacebookAuthProvider();

	try {
		const userCredential = await signInWithPopup(auth, provider);
		const info = getAdditionalUserInfo(userCredential);
		const user = userCredential.user;

		return { user, newUser: info?.isNewUser };
	} catch (error) {
		// The AuthCredential type that was used.
		// const credential = FacebookAuthProvider.credentialFromError(error);
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(errorCode);
		console.error(errorMessage);
	}
}

export async function signInWithMicrosoft(auth: Auth) {
	const provider = new OAuthProvider('microsoft.com');

	try {
		const userCredential = await signInWithPopup(auth, provider);
		const credential = OAuthProvider.credentialFromResult(userCredential);
		const info = getAdditionalUserInfo(userCredential);
		const user = userCredential.user;
		const accessToken = credential?.accessToken;

		const res = await fetch(
			'https://graph.microsoft.com/beta/me/photos/96x96/$value',
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const data = await res.blob();
		const imageUrl = window.URL.createObjectURL(data);

		return { user, imageUrl, newUser: info?.isNewUser };
	} catch (error) {
		// const credential = OAuthProvider.credentialFromError(error);
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(errorCode);
		console.error(errorMessage);
	}
}

export async function signInWithTwitter(auth: Auth) {
	const provider = new TwitterAuthProvider();

	try {
		const userCredential = await signInWithPopup(auth, provider);
		const info = getAdditionalUserInfo(userCredential);
		const user = userCredential.user;

		return { user, newUser: info?.isNewUser };
	} catch (error) {
		// const credential = TwitterAuthProvider.credentialFromError(error);
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(errorCode);
		console.error(errorMessage);
	}
}

export async function signInWithGithub(auth: Auth) {
	const provider = new GithubAuthProvider();
	try {
		const userCredential = await signInWithPopup(auth, provider);
		const info = getAdditionalUserInfo(userCredential);
		const user = userCredential.user;

		return { user, newUser: info?.isNewUser };
	} catch (error) {
		// const credential = GithubAuthProvider.credentialFromError(error);
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(errorCode);
		console.error(errorMessage);
	}
}

export async function signInWithDiscord(auth: Auth) {
	try {
		const userCredential = await withPopup(
			auth,
			'http://localhost:8080/auth/login?provider=discord',
			'Discord Auth',
			{
				height: 740,
			}
		);
		const info = getAdditionalUserInfo(userCredential);
		const user = userCredential.user;

		return { user, newUser: info?.isNewUser };
	} catch (error) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(errorCode);
		console.error(errorMessage);
	}
}

export interface WindowFeatures {
	[key: string]: any;
	width?: number;
	height?: number;
	top?: number;
	left?: number;
	menubar?: 'yes' | 'no';
	toolbar?: 'yes' | 'no';
	location?: 'yes' | 'no';
	resizable?: 'yes' | 'no';
	scrollbars?: 'yes' | 'no';
	status?: 'yes' | 'no';
}

async function withPopup(
	auth: Auth,
	url: string,
	name: string,
	options?: WindowFeatures
): Promise<UserCredential> {
	const width = options?.width || 500;
	const height = options?.height || 640;
	const top = options?.top || (window.screen.availHeight - height) / 2;
	const left = options?.left || (window.screen.availWidth - width) / 2;

	const opt = `
		width=${width},
		height=${height},
		top=${top},
		left=${left},
		toolbar=${options?.toolbar || 'no'},
		menubar=${options?.menubar || 'yes'},
		location=${options?.location || 'yes'},
		resizable=${options?.resizable || 'yes'},
		scrollbars=${options?.scrollbars || 'yes'},
		status=${options?.status || 'no'}
	`;

	const authWindow = window.open(url, name, opt);

	if (
		!authWindow ||
		authWindow.closed ||
		typeof authWindow.closed == 'undefined'
	) {
		//POPUP BLOCKED
		alert(
			'Bitte den PopUp Blocker entfernen, um sich mit Discord anzumelden'
		);
	}

	try {
		const origin = new URL(url).origin;
		const data = await waitForPopupLogin<OAuthUser>(origin);

		const userCredential = await signInWithCustomToken(auth, data.token);
		const user = userCredential.user;

		Promise.all([
			updateEmail(user, data.email),
			updateProfile(user, {
				displayName: data.displayName,
				photoURL: data.photoURL,
			}),
		]);

		authWindow?.close();
		return userCredential;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

function waitForPopupLogin<T>(origin: string): Promise<T> {
	return new Promise((resolve, reject) => {
		function listener(e: MessageEvent) {
			if (!e.origin.includes(origin)) return;
			window.removeEventListener('message', listener);
			resolve(e.data);
		}

		try {
			window.addEventListener('message', listener, false);
		} catch (error) {
			window.removeEventListener('message', listener);
			reject(new Error(error));
		}
	});
}

async function registerCredential() {}

async function runAsyncLogin<T>(
	promise: Promise<T>
): Promise<[T | null, any | null]> {
	try {
		const data = await promise;
		return [data, null];
	} catch (error) {
		console.error(error.code);
		console.error(error.message);
		return [null, error];
	}
}
