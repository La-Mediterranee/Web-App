<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	import Profile from '$lib/components/Customer/Profile';

	import type { User } from 'firebase/auth';

	let user: User | null = null;

	// Thinking about making this serverside redirect
	// check in a load function if there is a firebase token, if not redirect to login page
	if (browser) {
		if (!user) {
			goto('/customer/login');
		}
	}
</script>

<Profile {user} />
