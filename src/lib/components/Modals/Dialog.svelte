<script context="module" lang="ts">
	import Dialog from 'svelty-material/components/Dialog/Dialog.svelte';

	import { fade } from 'svelte/transition';
	import { onMount, SvelteComponent } from 'svelte';

	import type { CloseEvent, DialogOptions, ModalContext } from './types';
</script>

<script lang="ts">
	export let active = false;
	export let componentProps: Object = {};
	export let modalBody: (new (...args: unknown[]) => SvelteComponent) | null = null;
	export let options: DialogOptions = {
		alignItems: 'flex-start',
		fullscreen: true,
		style: undefined,
	};

	let reducedAnimation: typeof fade | undefined = undefined;

	onMount(() => {
		reducedAnimation = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
			? undefined
			: fade;
	});
</script>

<Dialog
	bind:active
	id="dialog"
	role="dialog"
	width="fit-content"
	transition={reducedAnimation}
	{...options}
	on:close={() => close()}
	on:escape={pushOnClose}
	on:overlay-click={pushOnClose}
>
	<svelte:component
		this={modalBody}
		{...componentProps}
		on:close={() => {
			pushOnClose();
			active = false;
		}}
	/>
</Dialog>

<style>
	/* your styles go here */
</style>
