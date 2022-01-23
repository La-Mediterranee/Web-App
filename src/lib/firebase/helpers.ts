import { getContext } from 'svelte';

import type { FirebaseContext, FirebaseAuthContext, FirebaseUserContext } from 'types/firebase';

export function getFirebaseContext() {
	return getContext<FirebaseContext>('firebase').getFirebase();
}

export function getAuthContext() {
	return getContext<FirebaseAuthContext>('auth')?.getAuth();
}

export function getUserContext() {
	return getContext<FirebaseUserContext>('user')?.getUser();
}
