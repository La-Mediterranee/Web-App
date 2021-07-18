<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { Unsubscriber } from 'svelte/store';
	import { customer } from './Auth';

	const dispatch = createEventDispatcher();

	let unsub: Unsubscriber;

	onMount(() => {
		unsub = customer.subscribe((user) => {
			dispatch('customer', {
				customer
			});
		});

		return () => unsub();
	});
</script>

<slot name="before" />

{#if $customer}
	<slot customer={$customer} auth={customer.auth} />
{:else}
	<slot name="signed-out" />
{/if}

<slot name="after" />
