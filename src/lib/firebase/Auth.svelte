<script lang="ts">
	import { authStore } from './auth';
	import { onMount, createEventDispatcher, setContext } from 'svelte';

	import type { Unsubscriber } from 'svelte/store';

	let unsub: Unsubscriber = () => {};

	const store = authStore();
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
