<script lang="ts">
	import { browser } from '$app/env';
	import { onMount, createEventDispatcher, setContext } from 'svelte';
	import {
		initializeAuth,
		inMemoryPersistence,
		indexedDBLocalPersistence,
		browserPopupRedirectResolver,
	} from 'firebase/auth';
	// @ts-ignore
	// import { _getProvider } from 'firebase/app';

	import { userStore } from './auth';
	import { getFirebaseContext } from './helpers';

	import type { Auth } from 'firebase/auth';
	import type { Unsubscriber } from 'svelte/store';

	let unsub: Unsubscriber = () => {};

	const dispatch = createEventDispatcher();

	const firebaseApp = getFirebaseContext();

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
		auth = initializeAuth(firebaseApp, {
			...(browser
				? {
						popupRedirectResolver: browserPopupRedirectResolver,
						persistence: [indexedDBLocalPersistence],
				  }
				: {
						persistence: [inMemoryPersistence],
				  }),
		});
	} catch (error) {
		console.error('authStore:', error);
		throw Error('authStore:' + error);
	}

	setContext('auth', {
		getAuth: () => auth,
	});

	const user = userStore(auth);

	setContext('user', {
		getUser: () => user,
	});

	try {
		onMount(() => {
			dispatch('customer', {
				user,
			});
		});
	} catch (error) {
		console.error('authStore:', error);
	}
</script>

<slot name="before" />

<slot {auth} user={$user} />

<slot name="after" />
