import { getContext } from 'svelte';
import { readable } from 'svelte/store'; //writable,
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import type { FirebaseContext } from 'types/firebase';

export function userStore() {
	const firebaseApp = getContext<FirebaseContext>('firebase').getFirebase();
	const auth = getAuth(firebaseApp);

	const storageKey: string = 'customer';
	const customer = localStorage.getItem(storageKey);
	const cached = customer ? JSON.parse(customer) : '';

	const store = readable(cached, (set) => {
		const teardown = onAuthStateChanged(auth, (customer) => {
			set(customer);
			localStorage && localStorage.setItem(storageKey, JSON.stringify(customer));
		});
		return () => teardown;
	});

	const { subscribe } = store;

	return {
		subscribe,
		auth
	};
}

export const user = userStore();

// const store = writable(cached, () => {
// 	const teardown = onAuthStateChanged(auth, (customer: User) => {
// 		set(customer);
// 		localStorage && localStorage.setItem(storageKey, JSON.stringify(customer));
// 	});
// 	return () => teardown;
// });

// const { subscribe, set } = store;
