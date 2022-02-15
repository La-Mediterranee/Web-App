<script context="module" lang="ts">
	import type { User } from 'firebase/auth';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	type Rec<T = any> = Record<string, T>;

	export function load({ session, url }: LoadInput<Rec<string>>): LoadOutput {
		console.log(session.user);

		if (!session.user) {
			return {
				redirect: `${url.pathname}/login`,
				status: 302,
			};
		}

		return {
			props: {
				user: session.user,
			},
		};
	}
</script>

<script lang="ts">
	import Profile from '$lib/components/Customer/Profile';

	export let user: User;

	// const user = getAuthContext();

	// // Thinking about making this serverside redirect
	// // check in a load function if there is a firebase token, if not redirect to login page
	// if (browser) {
	// 	if (!$user) {
	// 		goto($session.urlLocale + '/customer/login');
	// 	}
	// }
</script>

<Profile {user} />
