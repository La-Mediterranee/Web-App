<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	import { getAuthContext } from '$lib/firebase/helpers';
	import Profile from '$lib/components/Customer/Profile';

	const user = getAuthContext();

	// Thinking about making this serverside redirect
	// check in a load function if there is a firebase token, if not redirect to login page
	if (browser) {
		if (!$user) {
			goto('/customer/login');
		}
	}
</script>

<Profile {user} />
