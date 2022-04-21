<script context="module" lang="ts">
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import { setLocale } from '$i18n/utils';

	import type { LoadInput } from '@sveltejs/kit';
	import type { LoadOutput } from '@sveltejs/kit/types/internal';

	const routeName = 'customer';

	export async function load({ session }: LoadInput): Promise<LoadOutput> {
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
