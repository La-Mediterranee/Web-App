<script lang="ts">
	import { authStore } from './auth';
	import { onMount, createEventDispatcher, setContext } from 'svelte';

	import { getFirebaseContext } from './helpers';

	import type { Unsubscriber } from 'svelte/store';

	let unsub: Unsubscriber = () => {};

	const dispatch = createEventDispatcher();

	const firebaseApp = getFirebaseContext();
	let store: ReturnType<typeof authStore>;

	try {
		store = authStore(firebaseApp);
		setContext('user', {
			getAuth: () => store,
		});

		onMount(() => {
			unsub = store.subscribe((user) => {
				dispatch('customer', {
					user,
				});
			});

			return () => {
				unsub();
			};
		});
	} catch (error) {
		console.error('authStore:', error);
	}
</script>

<slot name="before" />

<slot user={$store} auth={store.auth} />

<slot name="after" />
