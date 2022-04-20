export async function loadDialog() {
	return (await import('svelty-material/components/Dialog')).default;
}

export async function loadMenuItemModal() {
	return (await import('$lib/components/Modals/MenuItemModal')).default;
}

export async function loadProductModal() {
	return (await import('$lib/components/Modals/ProductModal')).default;
}

export async function loadInfoModal() {
	const reducedMotionMq = window.matchMedia('screen and (min-width: 961px)');
	// return reducedMotionMq.matches
	// 	? (await import('$lib/components/Modals/InfoModal')).default
	// 	: (await import('$lib/components/Modals/InfoModal/MobileInfoModal.svelte')).default;
	return (await import('$lib/components/Modals/InfoModal')).default;
}
