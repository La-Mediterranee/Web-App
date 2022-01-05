<script>
	import Checkout from '$components/Checkout';
	import { getAuthContext } from '$lib/firebase/helpers';

	const user = getAuthContext();
</script>

<Checkout user={$user} />
