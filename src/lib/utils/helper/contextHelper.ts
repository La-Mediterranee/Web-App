import { getContext } from 'svelte';
import { MODAL, PRODUCT_MODAL } from '$lib/utils/constants';

import type { MenuItem, Product } from 'types/product';
import type { AppState, StripeContext } from 'types/index';
import type { App } from '$lib/stores/app';

export function getStripeContext() {
	return getContext<StripeContext>('stripe');
}

interface ModalContext {
	// open: (product: Product) => void;
	open: (product: MenuItem) => void;
	close: () => void;
}

export function getModalContext() {
	return getContext<ModalContext>(MODAL);
}

export function getProductModalContext() {
	return getContext<ModalContext>(PRODUCT_MODAL);
}
