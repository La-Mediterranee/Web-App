<script context="module" lang="ts">
	import Dialog from 'svelty-material/components/Dialog/Dialog.svelte';

	import { fade, scale, type EasingFunction, type TransitionConfig } from 'svelte/transition';
	import { afterUpdate, beforeUpdate, onMount, setContext, tick } from 'svelte';

	import { LL } from '$i18n/utils';
	import {
		checkForInfo,
		checkForMenuItem,
		checkForProduct,
		infoModalConfig,
	} from './utils/helper';
	import {
		GROCERY_SEARCH_KEY,
		ITEM_INFO_SEARCH_KEY,
		MENU_ITEM_SEARCH_KEY,
		MODAL_KEY,
	} from './utils/constants';
	import { loadInfoModal, loadMenuItemModal, loadProductModal } from './utils/dynamic-loaders';

	import type ProductModal from '$lib/components/Modals/ProductModal';
	import type MenuItemModal from '$lib/components/Modals/MenuItemModal';
	import type InfoModal from '$lib/components/Modals/InfoModal/InfoModal.svelte';

	import type { SvelteComponentTyped } from 'svelte';

	import type { MenuItem, Product } from 'types/product';
	import type { DialogOptions, ModalContext } from './types';
	import type { TransitionFn } from 'svelty-material/@types';
</script>

<script lang="ts">
	let menuItemModal: typeof MenuItemModal;
	let productModal: typeof ProductModal;
	let infoModal: typeof InfoModal;

	type SvelteComp<T = any> = new (...args: any) => SvelteComponentTyped<T>;

	let previousUrl: URL;

	let infoModalOpt = {
		dialogOptions: infoModalConfig,
		active: false,
		props: {},
	};

	let menuitemModalOpt = {
		active: false,
		props: {},
	};

	let menuitemAnimation: typeof fade | undefined = undefined;

	let infoAnimation: TransitionFn | undefined = undefined;

	let dialogs = new WeakMap();

	async function handleModalPop(_: PopStateEvent) {
		const searchParams = new URLSearchParams(window.location.search);
		const productPromise = checkForProduct(searchParams);
		const menuitemPromise = checkForMenuItem(searchParams);
		const infoPromise = checkForInfo(searchParams);

		const [product, menuitem, info] = await Promise.all([
			productPromise,
			menuitemPromise,
			infoPromise,
		]);

		if (product) open(productModal, { product });
		if (menuitem) openMenuItemModal(menuitem, false);
		if (info) openInfoModal(info, false);
	}

	function openWithPush(name: string, value: string) {
		const url = new URL(window.location.toString());
		url.searchParams.set(name, value);
		// goto(url.toString(), { replaceState: true, noscroll: true });
		history.pushState({ previousUrl: previousUrl.toString() }, '', url);
		history.scrollRestoration = 'auto';
	}

	function openProductModal(product: Product) {
		openWithPush(GROCERY_SEARCH_KEY, product.ID);
		open(productModal, { product });
	}

	function openMenuItemModal(menuitem: MenuItem, push: boolean = true) {
		if (menuitemModalOpt.active) return;
		// if (menuitem.top) menuitemModalOpt.top = menuitem.top;
		// if (menuitem.left) menuitemModalOpt.left = menuitem.left;

		// console.debug(menuitemModalOpt.top, menuitem.top);
		// console.debug(menuitemModalOpt.left, menuitem.left);

		menuitemModalOpt.active = true;
		menuitemModalOpt.props = { menuitem: menuitem };
		push && openWithPush(MENU_ITEM_SEARCH_KEY, menuitem.ID);
	}

	function openInfoModal(menuitem: MenuItem, push: boolean = true) {
		if (infoModalOpt.active) return;
		infoModalOpt.active = true;
		infoModalOpt.props = { menuitem, translations: $LL.product };
		push && openWithPush(ITEM_INFO_SEARCH_KEY, menuitem.ID);
	}

	function open<T>(component: SvelteComp<T>, props?: T, options: DialogOptions = {}) {
		options.alignItems = options?.alignItems || 'flex-start';
		options.fullscreen = options?.fullscreen ?? true;

		dialogs.set(component, {
			props,
			active: true,
			dialogOptions: options,
		});
		dialogs = dialogs;
	}

	function pushOnClose(key: string) {
		previousUrl.searchParams.delete(key);
		history.pushState(undefined, '', previousUrl || window.location.pathname);
		history.scrollRestoration = 'auto';
	}

	function closeInfoModal() {
		infoModalOpt.active = false;
		pushOnClose(ITEM_INFO_SEARCH_KEY);
	}

	function closeMenuItemModal() {
		menuitemModalOpt.active = false;
		pushOnClose(MENU_ITEM_SEARCH_KEY);
	}

	// function close(dialog: SvelteComp, modal: { active: boolean }) {
	// 	dialogs.delete(dialog);
	// 	dialogs = dialogs;
	// 	modal.active = false;
	// }

	setContext<ModalContext>(MODAL_KEY, {
		open,
		openInfoModal,
		// openInfoModalWithPush,
		openMenuItemModal,
	});

	let infoAnimationDuration = 2000;

	function infoMqHandler(e: MediaQueryListEvent) {
		infoAnimationDuration = e.matches ? 2000 : 2000;
	}

	function initInfoMq(reducedMotionMq: MediaQueryList) {
		const infoMq = window.matchMedia('screen and (min-width: 961px)');
		infoMq.addEventListener('change', infoMqHandler);
		infoAnimationDuration = infoMq.matches ? 2000 : 2000;

		return () => {
			infoMq.removeEventListener('change', infoMqHandler);
		};
	}

	onMount(() => {
		const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: no-preference)');
		const infoMqDestroy = initInfoMq(reducedMotionMq);

		if (reducedMotionMq.matches) {
			// menuitemAnimation = node => ({ duration: 1000 });
			menuitemAnimation = undefined;
			infoAnimation = () => ({ duration: infoAnimationDuration });
		} else {
			infoAnimation = fade;
			menuitemAnimation = fade;
		}
		window.addEventListener('popstate', handleModalPop);

		const idleID = window.requestIdleCallback(async () => {
			const modals = await Promise.all([
				loadMenuItemModal(),
				loadProductModal(),
				loadInfoModal(),
			]);

			menuItemModal = modals[0];
			productModal = modals[1];
			infoModal = modals[2];
		});

		previousUrl = new URL(window.location.toString());
		const searchParams = previousUrl.searchParams;
		checkForProduct(searchParams).then(async product => {
			productModal = await loadProductModal();
			if (product) open(productModal, { product });
		});
		checkForMenuItem(searchParams).then(async menuitem => {
			menuItemModal = await loadMenuItemModal();
			if (menuitem) openMenuItemModal(menuitem, false);
		});
		checkForInfo(searchParams).then(async menuitem => {
			infoModal = await loadInfoModal();
			if (menuitem) openInfoModal(menuitem, false);
		});

		return () => {
			window.removeEventListener('popstate', handleModalPop);
			window.cancelIdleCallback(idleID);
			infoMqDestroy();
		};
	});

	// $: if (browser) attach(infoModalOpt.active);
</script>

<slot />

<div id="menu-item-dialog-container">
	<Dialog
		id="menuitem-dialog"
		role="dialog"
		width="fit-content"
		inTransition={menuitemAnimation}
		outTransition={menuitemAnimation}
		active={menuitemModalOpt.active}
		fullscreen
		on:escape={closeMenuItemModal}
		on:overlay-click={closeMenuItemModal}
	>
		<svelte:component
			this={menuItemModal}
			{...menuitemModalOpt.props}
			on:close={closeMenuItemModal}
		/>
	</Dialog>
</div>

<div
	id="info-container"
	style="--overlay-z-index: 2; --animation-duration:{infoAnimationDuration}ms;"
>
	<Dialog
		id="info-dialog"
		role="dialog"
		width="100%"
		inTransition={infoAnimation}
		outTransition={infoAnimation}
		active={infoModalOpt.active}
		on:escape={closeInfoModal}
		on:overlay-click={closeInfoModal}
		style={`--theme-surface: transparent; touch-action: pan-y;`}
	>
		<svelte:component this={infoModal} {...infoModalOpt.props} on:close={closeInfoModal} />
	</Dialog>
</div>

<!-- <svelte:component this={infoModal} {...infoModalOpt.props} on:escape={closeInfoModal}
		on:overlay-click={closeInfoModal} on:close={closeInfoModal} /> -->

<!-- bind:active -->

<!-- {#each [...dialogs] as [dialog, props], i (dialog)}
	<Dialog
		id="dialog"
		role="dialog"
		width="fit-content"
		transition={reducedAnimation}
		active={props.active}
		{...props.dialogOptions}
		on:close={() => {
			props.active = false;
			close(dialog);
		}}
		on:escape={() => {
			props.active = false;
			pushOnClose();
		}}
		on:overlay-click={() => {
			props.active = false;
			console.debug('overlay click', i);
			pushOnClose();
		}}
	>
		<svelte:component
			this={dialog}
			{...props.props}
			on:close={() => {
				props.active = false;
				pushOnClose();
			}}
		/>
	</Dialog>
{/each} -->
<style lang="scss" global>
	#info-dialog {
		z-index: 3;
	}

	#menu-item-dialog-container {
		--s-dialog-content-overflow: visible;
		// --s-dialog-overflow: visible;

		// #menuitem-dialog {
		// 	position: absolute;
		// 	top: 0;
		// 	left: var(--left);
		// 	transform-origin: center top;
		// 	width: 100%;
		// 	height: 100%;
		// 	transform: scale(0.2) translateZ(0) translateX(0) translateY(var(--top));
		// 	transition: transform var(--animation-duration);
		// }

		// & .active #menuitem-dialog {
		// 	transform: scale(1) translateZ(0) translateX(calc(var(--left) * -1)) translateY(0);
		// 	transition: transform var(--animation-duration);
		// }
	}

	#info-container {
		--s-dialog-overflow: visible;

		height: 100%;

		@media screen and (max-width: 960px) {
			--s-dialog-width: 100%;

			& .s-dialog__container {
				justify-content: unset;
				align-items: unset;
			}

			& #info-dialog {
				position: absolute;
				// margin: 0 auto;
				width: 100%;
				bottom: 0;
				transform: translateY(100%);
				transition: transform var(--animation-duration) ease-out;
			}

			& .active #info-dialog {
				transform: translateY(var(--translate, 0));
				transition: transform var(--animation-duration) ease-in;
			}
		}

		@media screen and (min-width: 961px) {
			--s-dialog-width: auto;

			& #info-dialog {
				transform: scale(0);
				transform-origin: center;
				opacity: 0;
				transition: transform 300ms ease-out, opacity 300ms ease-out;
			}

			& .active #info-dialog {
				transform: scale(100%);
				opacity: 1;
				transition: transform 300ms ease-in, opacity 300ms ease-out;
			}
		}
	}

	.s-dialog__content {
		margin: 12px 0 0;
		box-shadow: none;
		/* margin: 0; */
	}
</style>
