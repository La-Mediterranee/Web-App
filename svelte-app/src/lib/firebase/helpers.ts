import { getContext } from 'svelte';

export function getFirebaseContext() {
	return getContext<FirebaseContext>('firebase').getFirebase();
}
