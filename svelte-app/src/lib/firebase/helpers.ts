import { getContext } from 'svelte';

import type { FirebaseContext } from 'types/firebase';

export function getFirebaseContext() {
	return getContext<FirebaseContext>('firebase').getFirebase();
}
