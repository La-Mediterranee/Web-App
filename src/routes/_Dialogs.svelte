<script context="module" lang="ts">
	import { onMount, setContext } from 'svelte';
	import { PRODUCT_MODAL, SERVER_URL } from '$lib/utils/constants';

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
	import { fetchFromAPI } from '$lib/utils';
	import Error from './__error.svelte';

	let mql: MediaQueryList;
	let active = false;
	let previousUrl: string;

	let componentProps: Object = {};
	let modalBody: (new (...args: unknown[]) => SvelteComponent) | null = null;

	function handleModalPop(_: PopStateEvent) {
		if (active) active = false;
	}

	function destroy() {
		window.removeEventListener('popstate', handleModalPop);
	}

	async function checkForProduct(searchParams: URLSearchParams) {
		if (!searchParams.has('item')) return;

		const id = searchParams.get('item');
		const res = await fetch(`${SERVER_URL}/v1/products/${id}`);
		if (!res.ok) return; //Promise.reject('Unable to fetch Item');
		const product = await res.json();
		openProductModal(product);
	}

	onMount(() => {
		window.addEventListener('popstate', handleModalPop);

		const searchParams = new URLSearchParams(window.location.search);
		checkForProduct(searchParams);

		return destroy;
	});

	function openProductModal(product: Product) {
		const position = {
			x: scrollX,
			y: scrollY,
		};
		// const previousUrl = window.location.pathname;
		previousUrl = window.location.pathname;

		const url = new URL(window.location.toString());
		url.searchParams.set('item', product.ID);
		history.pushState(position, '', url);
		history.scrollRestoration = 'auto';

		open(ProductModal, { product });
	}

	function open<T>(component: new (...args: any) => SvelteComponentTyped<T>, props?: T) {
		modalBody = component;
		componentProps = props || {};
		active = true;
	}

	function close(e?: CloseEvent) {
		history.pushState(undefined, '', previousUrl);
		history.scrollRestoration = 'auto';
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
