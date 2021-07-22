<script lang="ts">
	import { browser } from '$app/env';
	import { createAuthStore } from './Auth';
	import { onMount, createEventDispatcher } from 'svelte';

	import { getFirebaseContext } from './helpers';

	import type { Auth } from '@firebase/auth';
	import type { Unsubscribe } from '@firebase/util';
	import type { Unsubscriber } from 'svelte/store';

	const dispatch = createEventDispatcher();

	const store = createAuthStore();

	let unsub: Unsubscriber = () => {};

	let auth: {
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

			auth = store.init(firebaseApp);

			return () => {
				unsub();
				auth?.deinit();
			};
		});
	}
</script>

<slot name="before" />

<slot />
<!-- {#if $customer}
	<slot customer={$customer} auth={customer.auth} />
{:else}
	<slot name="signed-out" />
{/if} -->

<slot name="after" />
