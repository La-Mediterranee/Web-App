<script context="module" lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { getAuthContext } from '$lib/firebase/helpers';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export function load({ params, session }: LoadInput): LoadOutput {
		// console.debug('Page', page);
		// console.debug('Session', session);

		return {
			// redirect: '/customer/login',
			// status: 302,
		};
	}
</script>

<script lang="ts">
	import Profile from '$lib/components/Customer/Profile';

	import { session } from '$app/stores';

	const user = getAuthContext();

	// Thinking about making this serverside redirect
	// check in a load function if there is a firebase token, if not redirect to login page
	if (browser) {
		if (!$user) {
			goto('/' + $session.locale + '/customer/login');
		}
	}
</script>

<Profile {user} />
