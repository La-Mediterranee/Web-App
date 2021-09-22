import { readable, writable } from 'svelte/store'; //writable,
// import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
	initializeAuth,
	onAuthStateChanged,
	signOut,
	indexedDBLocalPersistence,
	browserLocalPersistence,
} from 'firebase/auth';

// import { getFirebaseContext } from './helpers';

import type { FirebaseApp } from 'firebase/app';
// import type { User } from 'firebase/auth';

export function authStore(app: FirebaseApp) {
	// const auth = getAuth(firebaseApp);
	const auth = initializeAuth(app, {
		persistence: [indexedDBLocalPersistence, browserLocalPersistence],
	});

	const logOut = () => signOut(auth);

	const storageKey: string = 'customer';
	const storage = typeof localStorage !== 'undefined' ? localStorage : null;
	const customer = storage?.getItem(storageKey);
	const cached = customer ? JSON.parse(customer) : '';

	const store = readable(cached, (set) => {
		const teardown = onAuthStateChanged(auth, (customer) => {
			set(customer);
			storage?.setItem(storageKey, JSON.stringify(customer));
		});
		return () => teardown;
	});

	const { subscribe } = store;

	return {
		subscribe,
		logOut,
		auth,
	};
}

// export function createAuthStore() {
// 	const storage = typeof localStorage !== 'undefined' ? localStorage : null;
// 	const storageKey: string = 'customer';
// 	const customer = storage?.getItem(storageKey);
// 	const cached: User | null = customer ? JSON.parse(customer) : null;

// 	const store = writable(cached);

// 	const { subscribe, set } = store;

// 	function init(app: FirebaseApp) {
// 		const auth = getAuth(app);

// 		const deinit = onAuthStateChanged(auth, (customer) => {
// 			set(customer);
// 			storage?.setItem(storageKey, JSON.stringify(customer));
// 		});

// 		const logOut = () => signOut(auth);

// 		return {
// 			logOut,
// 			deinit,
// 			auth,
// 		};
// 	}

// 	return {
// 		subscribe,
// 		init,
// 	};
// }
