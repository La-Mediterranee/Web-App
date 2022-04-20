<script context="module" lang="ts">
	import { loadLocaleAsync } from '$i18n/i18n-util.async';
	import { LL, setLocale } from '$i18n/utils';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';

	export async function load({ session }: LoadInput): Promise<LoadOutput> {
		await loadLocaleAsync(session.locale);

		return {
			props: {
				lang: session.locale,
			},
		};
	}
</script>

<script lang="ts">
	export let lang: Locales;

	setLocale(lang);
</script>

<div>
	{$LL.footer.about({ shopname: 'La' })}
</div>

<style>
	/* your styles go here */
</style>
