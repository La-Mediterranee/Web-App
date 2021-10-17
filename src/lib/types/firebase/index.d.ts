import type {
	CollectionReference,
	DocumentData,
	Query,
} from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Unsubscriber, Subscriber } from 'svelte/store';
import type { authStore } from '$lib/firebase/auth';

declare type Invalidator<T> = (value?: T) => void;

interface Options<T> {
	startWith?: T;
	log?: boolean;
	traceId?: string;
	once?: boolean;
}

interface FirebaseUser {
	readonly subscribe: (
		this: void,
		run: Subscriber<any>,
		invalidate?: Invalidator<any> | undefined
	) => Unsubscriber;
	readonly logOut: () => Promise<void>;
	readonly auth: Auth;
}

interface StorageOptions extends Options<Object> {
	meta?: string;
}

type QueryFn = (ref: CollectionReference<DocumentData>) => Query;

interface FirebaseContext {
	getFirebase: () => FirebaseApp;
}

interface FirebaseAuthContext {
	getAuth: () => ReturnType<typeof authStore>;
}
