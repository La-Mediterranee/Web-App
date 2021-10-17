import { writable } from 'svelte/store';
import { getFirestore, collection } from 'firebase/firestore/lite';

// Types
import type { DocumentData } from 'firebase/firestore';
import type { QueryFn, Options } from 'types/firebase';

// Svelte Store for Firestore Collection
export function collectionStore(path: string, queryFn: QueryFn, opts: Options<DocumentData | null>) {
	const firestore = getFirestore();

	const { startWith, log, traceId, maxWait, once, idField, refField } = {
		idField: 'id',
		refField: 'ref',
		maxWait: 10000,
		...opts,
	};

	// const ref = typeof path === 'string' ? collection(firestore, path) : path;
	const ref = collection(firestore, path);

	const query = queryFn && queryFn(ref);

	let _loading = typeof startWith !== undefined;
	let _error: unknown = null;
	let _meta = {};
	let _waitForIt: number;

	// Metadata for result
	const calcMeta = (val: DocumentData | null) => {
		return val?.length ? { first: val[0], last: val[val.length - 1] } : {};
	};

	const next = (val: DocumentData | null, err?: Error) => {
		_loading = false;
		_waitForIt && clearTimeout(_waitForIt);
		_error = err || null;
		_meta = calcMeta(val);
		set(val);
	};

	const start = () => {
		_waitForIt =
			maxWait &&
			window.setTimeout(
				() => _loading && next(null, new Error(`Timeout at ${maxWait}. Using fallback slot.`)),
				maxWait
			);
	};

	const store = writable(startWith, start);
	const { subscribe, set } = store;

	return {
		subscribe,
		firestore,
		ref,
		get loading() {
			return _loading;
		},
		get error() {
			return _error;
		},
		get meta() {
			return _meta;
		},
	};
}
