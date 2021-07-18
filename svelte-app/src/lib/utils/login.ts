import {
	signInWithRedirect,
	signInWithPopup,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	OAuthProvider,
	FacebookAuthProvider
} from '@firebase/auth';

import { Auth, TwitterAuthProvider, UserCredential } from 'firebase/auth';

interface AuthError {
	code: string;
	message: string;
}

// interface Microsoft

interface MicrosoftUserCredentials extends UserCredential {
	additionalUserInfo: Object;
}

export async function signIn(auth: Auth, email: string, password: string) {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		return user;
	} catch (err: unknown) {
		const errorCode = (err as AuthError).code;
		const errorMessage = (err as AuthError).message;
	}
}

export async function signInWithGoogle(auth: Auth) {
	const provider = new GoogleAuthProvider();

	try {
		const result = await signInWithPopup(auth, provider);

		// This gives you a Google Access Token. You can use it to access the Google API.
		// const credential = GoogleAuthProvider.credentialFromResult(result);
		// const token = credential?.accessToken;

		// The signed-in user info.
		const user = result.user;
		return user;
	} catch (err) {
		// Handle Errors here.
		const errorCode = err.code;
		const errorMessage = err.message;
		// The email of the user's account used.
		const email = err.email;
		// The AuthCredential type that was used.
		const credential = GoogleAuthProvider.credentialFromError(err);
	}
}
export async function signInWithFacebook(auth: Auth) {
	const provider = new FacebookAuthProvider();
	provider.setCustomParameters({
		display: 'popup'
	});

	try {
		const result = await signInWithPopup(auth, provider);
		// The signed-in user info.
		const user = result.user;
		return user;
		// // This gives you a Facebook Access Token. You can use it to access the Facebook API.
		// const credential = FacebookAuthProvider.credentialFromResult(result);
		// const accessToken = credential.accessToken;
	} catch (error) {
		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;
		// The email of the user's account used.
		const email = error.email;
		// The AuthCredential type that was used.
		const credential = FacebookAuthProvider.credentialFromError(error);
	}
}

export async function signInWithMicrosoft(auth: Auth) {
	const provider = new OAuthProvider('microsoft.com');
	try {
		const result = (await signInWithPopup(auth, provider)) as MicrosoftUserCredentials;
		// const result = await signInWithRedirect(auth, provider);
		// The signed-in user info.
		const user = result.user;
		console.log(result.additionalUserInfo);
		return user;
		// User is signed in.
		// IdP data available in result.additionalUserInfo.profile.

		// // Get the OAuth access token and ID Token
		// const credential = OAuthProvider.credentialFromResult(result);
		// const accessToken = credential.accessToken;
		// const idToken = credential.idToken;
	} catch (error) {
		// Handle error.
	}
}

export async function signInWithTwitter(auth: Auth) {
	const provider = new TwitterAuthProvider();

	try {
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		return user;
	} catch (error) {
		// Handle error.
		const credential = TwitterAuthProvider.credentialFromError(error);
	}
}
