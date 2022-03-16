import { getContext } from 'svelte';
import { MODAL, PRODUCT_MODAL } from '$lib/utils/constants';

import type { Product } from 'types/product';
import type { AppState, StripeContext } from 'types/index';

export function getStripeContext() {
	return getContext<StripeContext>('stripe');
}

interface ModalContext {
	open: (product: Product) => void;
	close: () => void;
}

export function getModalContext() {
	return getContext<ModalContext>(MODAL);
}

export function getProductModalContext() {
	return getContext<ModalContext>(PRODUCT_MODAL);
}

export function getAppContext(): AppState {
	return getContext<AppState>('App');
}
