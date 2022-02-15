<script lang="ts">
	import LL, { initI18n } from '$i18n/i18n-svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ session }: LoadInput): Promise<LoadOutput> {
		await initI18n(session.locale);

		return {};
	}
</script>

<div>
	{$LL.footer.about({ shopname: 'La' })}
</div>

<style>
	/* your styles go here */
</style>
