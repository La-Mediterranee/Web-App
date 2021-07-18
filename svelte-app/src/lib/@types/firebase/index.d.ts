import type { CollectionReference, DocumentData, Query } from 'firebase/firestore';

export interface Options<T> {
	startWith?: T;
	log?: boolean;
	traceId?: string;
	once?: boolean;
}

export interface StorageOptions extends Options<Object> {
	meta?: string;
}

export type QueryFn = (ref: CollectionReference<DocumentData>) => Query;
