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

		const selects = variations?.toppings?.map(topping => {
			return { [topping]: formData.get(topping) };
		});

		console.log(selects);
	}
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import ModalAside from './ModalAside.svelte';
	import ModalForm from './ModalForm.svelte';

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
	<Button fab depressed size="small" class="dialog-close-btn" on:click={close}>
		<Icon path={mdiClose} />
	</Button>
	<ModalAside {product} {currency} {locale} />
	<ModalForm {product} {quantitiy} {valid} {addToCart} on:close={() => (active = false)} />
</div>

<style lang="scss" global>
	.s-dialog__content {
		--s-dialog-content-overflow: visible;
		--s-dialog-justify-content: flex-start;
	}

	.container {
		--aside-width: 33.33%;
		--container-padding: 1.5em 0.8em 1.2em;
		display: block;
		position: relative;
	}

	.dialog-close-btn {
		position: absolute;
		top: 10px;
		right: 1em;
		// transform: translateY(-50%);
		background: var(--theme-surface);
		z-index: 10;
	}

	// $modalBP: 765px;
	$modalBP: 850px;

	@media screen and (min-width: $modalBP) {
		.container {
			display: flex;
		}
	}
</style>
