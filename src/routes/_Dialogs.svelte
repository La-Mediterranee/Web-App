<script context="module" lang="ts">
	import { onMount, setContext } from 'svelte';
	import { PRODUCT_MODAL } from '$lib/utils/constants';

	import type { Product } from 'types/product';
	import type { SvelteComponentTyped, SvelteComponent } from 'svelte';

	interface CloseEventDetail {
		close: Function;
	}

	export interface CloseEvent {
		readonly detail?: CloseEventDetail;
	}
</script>

<script lang="ts">
	import Dialog from 'svelty-material/components/Dialog/Dialog.svelte';
	import ProductModal from '$lib/components/Modals/ProductModal';

	let mql: MediaQueryList;
	let active = false;

	let componentProps: Object = {};
	let modalBody: (new (...args: any) => SvelteComponent) | null = null;

	function openProductModal(product: Product) {
		open(ProductModal, { product });
	}

	function open<T>(component: new (...args: any) => SvelteComponentTyped<T>, props?: T) {
		modalBody = component;
		componentProps = props || {};
		active = true;
	}

	function close(e?: CloseEvent) {
		e?.detail?.close();
		modalBody = null;
		componentProps = {};
	}

	setContext(PRODUCT_MODAL, {
		open: openProductModal,
	});
</script>

<slot />

<Dialog
	bind:active
	id="dialog"
	role="dialog"
	width="fit-content"
	alignItems="flex-start"
	fullscreen={true}
	on:close={() => close()}
>
	<svelte:component this={modalBody} {...componentProps} on:close={() => (active = false)} />
</Dialog>
