<script context="module" lang="ts">
	import '../app.css';

	import { mobileNavItems, desktopNavItems } from '$utils/navItems';
	import { getGlobal } from '$lib/utils';

	import { registerServiceWorker } from '$lib/pwa/register-sw';

	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export function load(params: LoadInput): LoadOutput {
		return {};
	}

	/**
	 * To enable optional chaining for window properties
	 * I defined window in the global scope. This shouldn't
	 * affect any libraries that checks for window because it
	 * still returns undefined
	 */
	const globals = getGlobal();

	if (typeof window === 'undefined') {
		//@ts-ignore
		globals.window = undefined;
	}
</script>

<script lang="ts">
	import Modals from './_Dialogs.svelte';

	import LDTag from '$lib/components/LDTag';
	import Navbar from '$lib/components/Navbar';
	import Footer from '$lib/components/Footer';
	import Statusbar from '$lib/components/Statusbar';
	import Tabbar from '$lib/components/Tabbar';
	import Installprompt from '$lib/components/Prompts/Installprompt';

	import { metatags } from '$lib/stores/metatags';
	import UpdatePrompt from '$lib/components/Prompts/SericeWorker/UpdatePrompt.svelte';

	let online: boolean = true;
</script>

<div id="mainContent">
	<Statusbar {online} />
	<Navbar routes={desktopNavItems} />
	<main>
		<Installprompt installSource={'LayoutInstallButton'} />
		<slot />
		<UpdatePrompt />
	</main>
	<Tabbar routes={mobileNavItems} />
	<Footer />
</div>
