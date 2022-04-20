import { getContext } from 'svelte';
import { PRODUCT_MODAL } from '$lib/utils/constants';

import type { MenuItem } from 'types/product';

interface ModalContext {
	open(menuitem: MenuItem): void;
	close: () => void;
}

export function getProductModalContext() {
	return getContext<ModalContext>(PRODUCT_MODAL);
}
