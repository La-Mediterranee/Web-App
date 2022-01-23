<script context="module" lang="ts">
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
	import { setContext } from 'svelte';
	import { PRODUCT_MODAL } from '$lib/utils/constants';

	import Dialog from 'svelty-material/components/Dialog/Dialog.svelte';
	import ProductModal from '$lib/components/Modals/ProductModal.svelte';

	let active = false;

	let modalBody: (new (...args: any) => SvelteComponent) | null = null;
	let componentProps: Object = {};

	function openProductModal(product: Product) {
		open(ProductModal, { product });
	}

	function open<T>(component: new (...args: any) => SvelteComponentTyped<T>, props?: T) {
		modalBody = component;
		componentProps = props || {};

		active = true;
	}

	function close({ detail }: CloseEvent) {
		detail?.close();
		modalBody = null;
		componentProps = {};

		active = false;
	}

	setContext(PRODUCT_MODAL, {
		open: openProductModal,
	});
</script>

<slot />

<Dialog width="auto" role="dialog" bind:active>
	<svelte:component this={modalBody} {...componentProps} on:close={close} />
</Dialog>
