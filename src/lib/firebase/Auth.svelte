<script lang="ts">
	import { authStore } from './auth';
	import { onMount, createEventDispatcher, setContext } from 'svelte';

	import { getFirebaseContext } from './helpers';

	import type { Unsubscriber } from 'svelte/store';

	let unsub: Unsubscriber = () => {};

	const firebaseApp = getFirebaseContext();
	const store = authStore(firebaseApp);

	const dispatch = createEventDispatcher();

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
</script>

<slot name="before" />

<slot user={$store} auth={store.auth} />

<slot name="after" />
