<script>
	import { session } from '$app/stores';

	import Checkout from '$components/Checkout';
	// import { getAuthContext, getUserContext } from '$lib/firebase/helpers';
	// const user = getUserContext();
</script>

<Checkout user={$session.user} />
