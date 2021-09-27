import { readable } from 'svelte/store'; //writable,
import {
	onAuthStateChanged,
	signOut,
	// getAuth,
	initializeAuth,
	inMemoryPersistence,
	indexedDBLocalPersistence,
	browserPopupRedirectResolver,
} from 'firebase/auth';
// @ts-ignore
import { _getProvider } from '@firebase/app';

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
		const provider = _getProvider(app, 'auth');

		auth = provider.isInitialized()
			? provider.getImmediate()
			: initializeAuth(app, {
					...(typeof window === 'undefined'
						? {
								persistence: [inMemoryPersistence],
						  }
						: {
								// popupRedirectResolver:
								// 	browserPopupRedirectResolver,
								persistence: [indexedDBLocalPersistence],
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
		if (typeof window !== 'undefined') {
			const idb = indexedDB.open(DB_NAME);
			idb.onsuccess = function (e) {
				// const db = (e.target as IDBRequest<IDBDatabase>).result;

				// const dbReq = db
				// 	.transaction(DB_OBJECTSTORE_NAME)
				// 	.objectStore(DB_OBJECTSTORE_NAME)
				// 	.getAll();

				// dbReq.onsuccess = (e) => {
				// 	const target = e.target as IDBRequest<any[]>;
				// 	const user = target.result[0]?.value as User;
				// 	set(user);
				// };

				this.result
					.transaction(DB_OBJECTSTORE_NAME)
					.objectStore(DB_OBJECTSTORE_NAME)
					.getAll().onsuccess = (e) => {
					const target = e.target as IDBRequest<DBObject[]>;
					const user = target.result[0]?.value;
					set(user);
				};

				this.result.onerror = function (e) {
					console.error('Database error: ' + e.target);
				};
			};

			idb.onerror = function (e) {
				console.error('idb:', this.error);
				// console.error(
				// 	'idb:',
				// 	(e.target as IDBRequest<IDBDatabase>).error
				// );
			};
		}

		const teardown = onAuthStateChanged(auth, (user) => {
			try {
				console.log(user);
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
