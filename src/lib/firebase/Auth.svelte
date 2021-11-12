<script lang="ts">
	import { authStore } from './auth';
	import { onMount, createEventDispatcher, setContext } from 'svelte';

	import { getFirebaseContext } from './helpers';

	import type { Unsubscriber } from 'svelte/store';

	let unsub: Unsubscriber = () => {};

	const dispatch = createEventDispatcher();

	const firebaseApp = getFirebaseContext();
	const store = authStore(firebaseApp);
	const user = $store;

	setContext('user', {
		getAuth: () => store,
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

<slot user={$store} auth={store.auth} />

<slot name="after" />
