import { openDB } from 'idb';

import type { DBSchema, StoreNames } from 'idb';

export async function initIDB<T extends DBSchema | unknown = unknown>(
	dbName: string,
	storeName: string
) {
	const db = await openDB<T>(dbName, 1, {
		upgrade(db) {
			db.createObjectStore(storeName as StoreNames<T>);
		}
	});

	return db;
}

// In the following line, you should include the prefixes of implementations you want to test.
//@ts-ignore
window.indexedDB =
	//@ts-ignore
	window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction ||
	//@ts-ignore
	window.webkitIDBTransaction ||
	//@ts-ignore
	window.msIDBTransaction || { READ_WRITE: 'readwrite' }; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange =
	window.IDBKeyRange ||
	//@ts-ignore
	window.webkitIDBKeyRange ||
	//@ts-ignore
	window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
