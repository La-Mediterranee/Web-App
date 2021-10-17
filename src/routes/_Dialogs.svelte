<script context="module" lang="ts">
	import ProductModal from '$lib/components/Modals/ProductModal.svelte';

	import { setContext } from 'svelte';
	import { PRODUCT_MODAL } from '$lib/utils/constants';

	import type { Product } from 'types/product';

	type Modals = typeof ProductModal;

	const current: {
		component: Modals | null;
		props: Object | null;
	} = {
		component: null,
		props: null,
	};
</script>

<script lang="ts">
	import Dialog from 'svelte-material-components/src/components/Dialog/Dialog.svelte';

	let active = false;

	function openProductModal(product: Product) {
		open(ProductModal, { product });
	}

	function open(component: Modals | null, props: Object) {
		current.component = component;
		current.props = props;
		active = true;
	}

	function close(event: { detail?: { close: Function } }) {
		event.detail?.close();
		current.component = null;
		active = false;
	}

	setContext(PRODUCT_MODAL, {
		open: openProductModal,
	});
</script>

<slot />
<Dialog width="auto" role="dialog" bind:active>
	<svelte:component this={current.component} {...current.props} on:close={close} />
</Dialog>
