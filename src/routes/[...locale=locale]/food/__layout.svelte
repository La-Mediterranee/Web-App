<script context="module" lang="ts">
	import LDTag from '$lib/components/LDTag';

	import { session } from '$app/stores';

	import type { LoadOutput } from '@sveltejs/kit/types/internal';
	import type { BreadcrumbList, WithContext } from 'schema-dts';
	import LL from '$i18n/i18n-svelte';

	const routeName = 'food';

	export function load(): LoadOutput {
		return {
			stuff: {
				activeRoute: routeName,
			},
		};
	}
</script>

<script lang="ts">
	let breadcrumb: WithContext<BreadcrumbList>;
	$: breadcrumb = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		'itemListElement': [
			{
				'@type': 'ListItem',
				'position': 1,
				'item': {
					'@id': `https://example.com${$session.urlLocale}`,
					'name': $LL.nav.routes.homepage(),
				},
			},
			{
				'@type': 'ListItem',
				'position': 2,
				'item': {
					'@id': 'https://example.com/${$session.urlLocale}/food',
					'name': $LL.nav.routes.food(),
				},
			},
		],
	};
</script>

<LDTag schema={breadcrumb} />

<slot />
