import { browser } from '$app/env';
import { readable } from 'svelte/store'; //writable,
import { onAuthStateChanged, signOut } from 'firebase/auth';

import type { User, Auth } from 'firebase/auth';

export type AuthStore = ReturnType<typeof userStore>;

const DB_OBJECTSTORE_NAME = 'firebaseLocalStorage';
const DB_NAME = 'firebaseLocalStorageDb';

interface DBObject {
	fbase_key: string;
	value: User;
}

export function userStore(auth: Auth) {
	const logOut = () => signOut(auth);

	const cached = null;

	const store = readable<User | null>(cached, set => {
		// if (browser) {
		// 	(async () => {
		// 		try {
		// 			set(await getUserfromIdb());
		// 		} catch (error) {
		// 			console.error(error);
		// 		}
		// 	})();
		// }

		const teardown = onAuthStateChanged(auth, user => {
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

async function getUserfromIdb() {
	const idb = indexedDB.open(DB_NAME);

	idb.onupgradeneeded = function () {
		console.log('upgrade needed');
		// this.result.createObjectStore(DB_OBJECTSTORE_NAME);
		// this.transaction?.abort();
	};

	return new Promise<User>((resolve, reject) => {
		idb.onsuccess = function () {
			const db = this.result;

			db.onerror = function (e) {
				reject('Database Error');
				console.error('Database error: ' + e.target);
			};

			const transaction = db.transaction(DB_OBJECTSTORE_NAME, 'readonly');

			transaction.oncomplete = function () {};

			transaction.onabort = function () {
				reject('transaction was aborted: ' + this.error);
				console.log('transaction was aborted');
			};

			transaction.onerror = function () {
				reject(this.error);
				console.error('transaction:', this.error);
			};

			const objectStore = transaction.objectStore(DB_OBJECTSTORE_NAME);

			const req = objectStore.getAll();

			req.onsuccess = e => {
				const target = e.target as IDBRequest<DBObject[]>;
				const user = target.result[0]?.value;
				resolve(user);
			};

			req.onerror = function () {
				reject(this.error);
				console.error('objectStore:', this.error);
			};
		};

		idb.onerror = function () {
			reject(this.error);
			console.error('idb:', this.error);
		};
	});
}
