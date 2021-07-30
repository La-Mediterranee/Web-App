import type { CollectionReference, DocumentData, Query } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Unsubscriber, Subscriber } from 'svelte/store';

declare type Invalidator<T> = (value?: T) => void;

interface Options<T> {
	startWith?: T;
	log?: boolean;
	traceId?: string;
	once?: boolean;
}

interface FirebaseUser {
	subscribe: (
		this: void,
		run: Subscriber<any>,
		invalidate?: Invalidator<any> | undefined
	) => Unsubscriber;
	logOut: () => Promise<void>;
	auth: Auth;
}

interface StorageOptions extends Options<Object> {
	meta?: string;
}

type QueryFn = (ref: CollectionReference<DocumentData>) => Query;

interface FirebaseContext {
	getFirebase: () => FirebaseApp;
}

interface FirebaseAuthContext {
	getAuth: () => FirebaseUser;
}
