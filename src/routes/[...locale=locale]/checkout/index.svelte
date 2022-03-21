<script lang="ts">
	import { session } from '$app/stores';

	import Checkout from '$components/Checkout';
	// import { getAuthContext, getUserContext } from '$lib/firebase/helpers';
	// const user = getUserContext();
	export let value: number[] | undefined;
	export let currentValue: number | undefined;

	console.debug(value, currentValue);
</script>

<Checkout user={$session.user} {value} {currentValue} />
