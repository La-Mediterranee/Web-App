<script context="module" lang="ts">
	import { onMount, setContext } from 'svelte';
	import { PRODUCT_MODAL, SERVER_URL } from '$lib/utils/constants';

	import type { MenuItem, Product } from 'types/product';
	import type { SvelteComponentTyped, SvelteComponent } from 'svelte';

	interface CloseEventDetail {
		close: Function;
	}

	export interface CloseEvent {
		readonly detail?: CloseEventDetail;
	}

	const GROCERY_SEARCH_KEY = 'grocery';
	const MENU_ITEM_SEARCH_KEY = 'menuitem';
</script>

<script lang="ts">
	import Dialog from 'svelty-material/components/Dialog/Dialog.svelte';
	import ProductModal from '$lib/components/Modals/ProductModal';
	import MenuItemModal from '$lib/components/Modals/MenuItemModal';

	let active = false;
	let previousUrl: string;

	let componentProps: Object = {};
	let modalBody: (new (...args: unknown[]) => SvelteComponent) | null = null;

	async function handleModalPop(_: PopStateEvent) {
		if (active) return (active = false);

		const searchParams = new URLSearchParams(window.location.search);
		const productPromise = checkForProduct(searchParams);
		const menuitemPromise = checkForMenuItem(searchParams);

		const [product, menuitem] = await Promise.all([productPromise, menuitemPromise]);

		if (product) open(ProductModal, { product });
		if (menuitem) open(MenuItemModal, { menuitem });
	}

	async function checkForProduct(searchParams: URLSearchParams) {
		if (!searchParams.has(GROCERY_SEARCH_KEY)) return;

		const id = searchParams.get(GROCERY_SEARCH_KEY);
		const res = await fetch(`${SERVER_URL}/v1/products/${id}?type=grocery`);
		if (!res.ok) return null;
		const product = await res.json();
		return product;
	}

	async function checkForMenuItem(searchParams: URLSearchParams) {
		if (!searchParams.has(MENU_ITEM_SEARCH_KEY)) return;

		const id = searchParams.get(MENU_ITEM_SEARCH_KEY);
		const res = await fetch(`${SERVER_URL}/v1/products/${id}?type=menuitem`);
		if (!res.ok) return null;
		const product = await res.json();
		return product;
	}

	function destroy() {
		window.removeEventListener('popstate', handleModalPop);
	}

	onMount(() => {
		window.addEventListener('popstate', handleModalPop);

		const searchParams = new URLSearchParams(window.location.search);
		checkForProduct(searchParams).then(product => {
			if (product) open(ProductModal, { product });
		});
		checkForMenuItem(searchParams).then(menuitem => {
			if (menuitem) open(MenuItemModal, { menuitem });
		});

		return destroy;
	});

	function openMenuItemModal(menuitem: MenuItem) {
		// const previousUrl = window.location.pathname;
		previousUrl = window.location.pathname;

		const url = new URL(window.location.toString());
		url.searchParams.set(MENU_ITEM_SEARCH_KEY, menuitem.ID);
		history.pushState({ previousUrl }, '', url);
		history.scrollRestoration = 'auto';

		open(MenuItemModal, { menuitem });
	}

	function openProductModal(product: Product) {
		const position = {
			x: scrollX,
			y: scrollY,
		};
		// const previousUrl = window.location.pathname;
		previousUrl = window.location.pathname;

		const url = new URL(window.location.toString());
		url.searchParams.set(GROCERY_SEARCH_KEY, product.ID);
		history.pushState({ position, previousUrl }, '', url);
		history.scrollRestoration = 'auto';

		open(ProductModal, { product });
	}

	function open<T>(component: new (...args: any) => SvelteComponentTyped<T>, props?: T) {
		modalBody = component;
		componentProps = props || {};
		active = true;
	}

	function pushOnClose() {
		history.pushState(undefined, '', previousUrl || window.location.pathname);
		history.scrollRestoration = 'auto';
	}

	function close(e?: CloseEvent) {
		e?.detail?.close();
		modalBody = null;
		componentProps = {};
	}

	setContext(PRODUCT_MODAL, {
		// open: openProductModal,
		open: openMenuItemModal,
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
	on:escape={e => {
		pushOnClose();
	}}
	on:close={() => close()}
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
