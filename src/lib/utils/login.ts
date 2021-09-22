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
	browserPopupRedirectResolver,
	AuthProvider,
} from 'firebase/auth';

import type { User, Auth, UserCredential } from 'firebase/auth';

interface AuthError {
	code: string;
	message: string;
}

export interface LoginInfo {
	user: User;
	newUser: boolean;
}

export interface OAuthUser {
	token: string;
	email: string;
	displayName: string;
	photoURL: string;
}

export async function signIn(auth: Auth, email: string, password: string) {
	return await runAsyncLogin(async () => {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		return { user, newUser: false };
	});
}

export async function signInWithGoogle(auth: Auth) {
	const provider = new GoogleAuthProvider();
	return await runProviderLogin(
		auth,
		provider,
		async (userCredential, newUser) => {
			return { user: userCredential.user, newUser };
		}
	);
}

export async function signInWithFacebook(auth: Auth) {
	const provider = new FacebookAuthProvider();
	return await runProviderLogin(
		auth,
		provider,
		async (userCredential, newUser) => {
			return { user: userCredential.user, newUser };
		}
	);
}

export async function signInWithTwitter(auth: Auth) {
	const provider = new TwitterAuthProvider();
	return await runProviderLogin(
		auth,
		provider,
		async (userCredential, newUser) => {
			return { user: userCredential.user, newUser };
		}
	);
}

export async function signInWithGithub(auth: Auth) {
	const provider = new GithubAuthProvider();
	return await runProviderLogin(
		auth,
		provider,
		async (userCredential, newUser) => {
			return { user: userCredential.user, newUser };
		}
	);
}

export async function signInWithMicrosoft(auth: Auth) {
	const provider = new OAuthProvider('microsoft.com');
	return await runProviderLogin(
		auth,
		provider,
		async (userCredential, newUser) => {
			const credential =
				OAuthProvider.credentialFromResult(userCredential);
			const accessToken = credential?.accessToken;

			const res = await fetch(
				// "https://graph.microsoft.com/v1.0/me/photos/96x96/$value",
				'https://graph.microsoft.com/beta/me/photos/96x96/$value',
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			const url = window.URL || window.webkitURL;
			const data = await res.blob();
			const imageUrl = url.createObjectURL(data);

			if (auth.currentUser) {
				//@ts-ignore
				auth.currentUser.photoURL = imageUrl;
			}

			return { user: userCredential.user, newUser };
		}
	);
}

export async function signInWithDiscord(auth: Auth) {
	return await runAsyncLogin(async () => {
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

		return { user, newUser: info?.isNewUser ?? false };
	});
}

async function runProviderLogin(
	auth: Auth,
	provider: AuthProvider,
	cb: (userCredential: UserCredential, newUser: boolean) => Promise<LoginInfo>
) {
	return await runAsyncLogin(async () => {
		const userCredential = await signInWithPopup(
			auth,
			provider,
			browserPopupRedirectResolver
		);

		const info = getAdditionalUserInfo(userCredential);

		return await cb(userCredential, info?.isNewUser ?? true);
	});
}

async function runAsyncLogin(
	promise: () => Promise<LoginInfo>
): Promise<LoginInfo | null> {
	try {
		const data = await promise();
		return data;
	} catch (error) {
		const errorCode = (error as AuthError).code;
		const errorMessage = (error as AuthError).message;
		console.error(errorCode);
		console.error(errorMessage);
		return null;
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

		const info = getAdditionalUserInfo(userCredential);

		info?.isNewUser &&
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
		throw new Error((error as Error).message);
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
			reject(error);
		}
	});
}

async function registerCredential() {}

// async function runAsyncLogin<T>(
// 	promise: Promise<T> // | (() => Promise<T>)
// ): Promise<[T | null, any | null]> {
// 	try {
// 		const data = await promise;
// 		return [data, null];
// 	} catch (error) {
// 		const errorCode = (error as AuthError).code;
// 		const errorMessage = (error as AuthError).message;
// 		console.error(errorCode);
// 		console.error(errorMessage);
// 		return [null, error];
// 	}
// }
