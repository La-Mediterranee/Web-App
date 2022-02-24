<svelte:options immutable />

<script context="module" lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { mdiClose } from '@mdi/js';

	import type { Product, Variations } from 'types/product';

	const AmountLabel = 'Menge';

	export type AddToCart = typeof addToCart;

	function addToCart(e: Event, variations?: Variations) {
		const ev = e as SubmitEvent;
		const form = ev.target as HTMLFormElement;
		const formData = new FormData(form);
	}
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import ModalAside from '$components/Modals/ProductModal/ModalAside.svelte';
	import ModalForm from '$components/Modals/ProductModal/ModalForm.svelte';

	export let product: Product;
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';

	let active = true;
	let quantitiy = 1;
	let valid = false;

	const { variations, price } = product;

	const _price = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(price);

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}
</script>

<div class="container">
	<ModalAside {product} {currency} {locale} />
	<ModalForm {product} {quantitiy} {valid} {addToCart} on:close={() => (active = false)} />
</div>

<style lang="scss" global>
	.container {
		--aside-width: 33.33%;
		--container-padding: 1.5em 0.8em 1.2em;
		display: block;
		position: relative;
	}

	// $modalBP: 765px;
	$modalBP: 850px;
	@media screen and (min-width: $modalBP) {
		.container {
			display: flex;
		}
	}
</style>
