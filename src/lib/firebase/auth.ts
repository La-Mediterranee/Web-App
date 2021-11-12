import { browser } from '$app/env';
import { readable } from 'svelte/store'; //writable,
import {
	onAuthStateChanged,
	signOut,
	initializeAuth,
	inMemoryPersistence,
	indexedDBLocalPersistence,
	browserPopupRedirectResolver,
} from 'firebase/auth';
// @ts-ignore
// import { _getProvider } from 'firebase/app';

import type { FirebaseApp } from 'firebase/app';
import type { User, Auth } from 'firebase/auth';

export type AuthStore = ReturnType<typeof authStore>;

const DB_OBJECTSTORE_NAME = 'firebaseLocalStorage';
const DB_NAME = 'firebaseLocalStorageDb';

interface DBObject {
	fbase_key: string;
	value: User;
}

export function authStore(app: FirebaseApp) {
	let auth: Auth;
	try {
		// const provider = _getProvider(app, 'auth');

		// auth = provider.isInitialized()
		// 	? provider.getImmediate()
		// 	: initializeAuth(app, {
		// 			...(browser
		// 				? {
		// 						popupRedirectResolver: browserPopupRedirectResolver,
		// 						persistence: [indexedDBLocalPersistence],
		// 				  }
		// 				: {
		// 						persistence: [inMemoryPersistence],
		// 				  }),
		// 	  });
		auth = initializeAuth(app, {
			...(browser
				? {
						popupRedirectResolver: browserPopupRedirectResolver,
						persistence: [indexedDBLocalPersistence],
				  }
				: {
						persistence: [inMemoryPersistence],
				  }),
		});
		// console.log('auth:', auth);
	} catch (error) {
		console.error('authStore:', error);
		throw Error('authStore:' + error);
	}

	const logOut = () => signOut(auth);

	const cached = null;

	const store = readable<User | null>(cached, (set) => {
		if (browser) {
			try {
				const idb = indexedDB.open(DB_NAME);

				idb.onupgradeneeded = function () {
					console.log('upgrade needed');
					// this.result.createObjectStore(DB_OBJECTSTORE_NAME);
					// this.transaction?.abort();
				};

				idb.onsuccess = function () {
					const db = this.result;

					db.onerror = function (e) {
						console.error('Database error: ' + e.target);
					};

					const transaction = db.transaction(DB_OBJECTSTORE_NAME, 'readonly');

					transaction.oncomplete = function () {};

					transaction.onabort = function () {
						console.log('transaction was aborted');
					};

					transaction.onerror = function () {
						console.error('transaction:', this.error);
					};

					const objectStore = transaction.objectStore(DB_OBJECTSTORE_NAME);

					const req = objectStore.getAll();

					req.onsuccess = (e) => {
						const target = e.target as IDBRequest<DBObject[]>;
						const user = target.result[0]?.value;
						set(user);
					};

					req.onerror = function () {
						console.error('objectStore:', this.error);
					};
				};

				idb.onerror = function () {
					console.error('idb:', this.error);
				};
			} catch (error) {
				console.error(error);
			}
		}

		const teardown = onAuthStateChanged(auth, (user) => {
			try {
				set(user);
			} catch (error) {
				console.error('onAuthState:', error);
				set(null);
			}
		});

		return () => teardown;
	});

	const { subscribe } = store;

	return {
		subscribe,
		logOut,
		auth,
	} as const;
}
