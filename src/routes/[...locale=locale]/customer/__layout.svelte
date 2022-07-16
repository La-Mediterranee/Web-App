<script context="module" lang="ts">
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import { setLocale } from '$i18n/utils';

	import type { LoadEvent } from '@sveltejs/kit';
	import type { LoadOutput } from '@sveltejs/kit/types';

	const routeName = 'customer';

	export async function load({ session }: LoadEvent): Promise<LoadOutput> {
		await loadNamespaceAsync(session.locale, 'user');
		return {
			stuff: {
				activeRoute: routeName,
			},
		};
	}
</script>

<script lang="ts">
	import { session } from '$app/stores';

	setLocale($session.locale);
</script>

<slot />
