<script context="module" lang="ts">
	export const prerender = true;
	import type { LoadEvent, LoadOutput } from '@sveltejs/kit/types';

	export async function load({ session }: LoadEvent): Promise<LoadOutput> {
		if (session.user) {
			return {
				status: 302,
				redirect: `${session.urlLocale}/customer`,
			};
		}

		return {};
	}
</script>

<script lang="ts">
	import Auth from '$lib/firebase/Auth.svelte';
	import Login from '$lib/components/Customer/Login';
</script>

<Auth>
	<Login />
</Auth>
