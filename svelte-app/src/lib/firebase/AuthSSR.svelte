<script>
	import { browser } from '$app/env';
	import { onMount, createEventDispatcher, setContext } from 'svelte';

	import { createAuthStore } from './Auth';
	import { getFirebaseContext } from './helpers';

	import type { Auth } from 'firebase/auth';
	import type { Unsubscribe } from 'firebase/auth';
	import type { Unsubscriber } from 'svelte/store';

	let unsub: Unsubscriber = () => {};

	const dispatch = createEventDispatcher();

	setContext('firebaseAuth', {
		getUser: () => user
	});

	const store = createAuthStore();

	let user: {
		logOut: () => Promise<void>;
		deinit: Unsubscribe;
		auth: Auth;
	};

	const firebaseApp = getFirebaseContext();

	if (browser) {
		onMount(() => {
			unsub = store.subscribe((user) => {
				dispatch('customer', {
					user
				});
			});

			user = store.init(firebaseApp);

			return () => {
				unsub();
				user?.deinit();
			};
		});
	}

	console.log($store);
</script>

<slot name="before" />

<slot user={$store} auth={user?.auth} />

<slot name="after" />
