import { getContext } from 'svelte';

import type { FirebaseContext, FirebaseAuthContext } from 'types/firebase';

export function getFirebaseContext() {
	return getContext<FirebaseContext>('firebase').getFirebase();
}

export function getAuthContext() {
	return getContext<FirebaseAuthContext>('user')?.getAuth();
}
