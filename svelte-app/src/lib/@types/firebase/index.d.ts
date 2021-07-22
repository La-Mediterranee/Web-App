import type { CollectionReference, DocumentData, Query } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';

interface Options<T> {
	startWith?: T;
	log?: boolean;
	traceId?: string;
	once?: boolean;
}

interface StorageOptions extends Options<Object> {
	meta?: string;
}

type QueryFn = (ref: CollectionReference<DocumentData>) => Query;

interface FirebaseContext {
	getFirebase: () => FirebaseApp;
}
