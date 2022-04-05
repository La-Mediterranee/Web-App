<svelte:options immutable />

<script context="module" lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { mdiClose } from '@mdi/js';

	import type { MenuItem, Topping } from 'types/product';

	function addToCart(e: Event, toppings: readonly Topping[]) {
		const ev = e as SubmitEvent;
		const form = ev.target as HTMLFormElement;
		const formData = new FormData(form);

		for (const topping of toppings) {
			const set = new Set(formData.getAll(topping.ID));
			console.debug(topping.ID, set, formData.getAll(topping.ID));
		}
	}
</script>

<script lang="ts">
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';

	import ModalForm from './ModalForm/ModalForm.svelte';
	import ModalAside from './ModalAside/ModalAside.svelte';
	import ItemDesc from './ModalAside/ItemDesc.svelte';

	import { formatPrice } from '$lib/stores/cart';

	export let menuitem: MenuItem;
	export let locale: string = 'de-DE';

	let active = true;
	let quantitiy = 1;
	let valid = false;

	const { toppings, price } = menuitem;

	const dispatch = createEventDispatcher();

	function checkIfValid(e: Event) {
		const formData = new FormData(<HTMLFormElement>e.currentTarget);
		const browserValid = (<HTMLFormElement>e.currentTarget).checkValidity();
		if (!browserValid) return (valid = false);

		for (const topping of toppings) {
			const set = new Set(formData.getAll(topping.ID));
			// console.debug(set);
			if (set.size < topping.qtyMin || set.size > topping.qtyMax) {
				return (valid = false);
			}
		}

		return (valid = true);
	}

	function close() {
		dispatch('close');
	}
</script>

<div class="product-modal-container">
	<Button fab depressed size="small" class="dialog-close-btn" on:click={close}>
		<Icon path={mdiClose} />
	</Button>
	<ModalAside image={menuitem.image}>
		{menuitem.name}

		<data slot="price" value={`${price}`}>
			{formatPrice(price, locale)}
		</data>

		<svelte:fragment slot="description">
			{#if menuitem.desc}
				<ItemDesc>
					{menuitem.desc}
				</ItemDesc>
			{/if}
		</svelte:fragment>
	</ModalAside>
	<ModalForm
		{menuitem}
		{quantitiy}
		{valid}
		on:change={checkIfValid}
		on:submit={e => addToCart(e, menuitem.toppings)}
		on:close={() => (active = false)}
	/>
</div>

<style lang="scss" global>
	.s-dialog__content {
		--s-dialog-content-overflow: visible;
		--s-dialog-justify-content: flex-start;
	}

	.product-modal-container {
		--aside-width: 33.33%;
		--container-padding: 1.5em 0.8em 1.2em;
		display: block;
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;

		.actions {
			left: 10px;
			bottom: 10px;
			right: 10px;
		}

		.dialog-close-btn {
			position: absolute;
			top: 10px;
			right: 1em;
			// transform: translateY(-50%);
			background: var(--theme-surface);
			z-index: 10;
		}
	}

	// $modalBP: 765px;
	$modalBP: 850px;

	@media screen and (min-width: $modalBP) {
		.product-modal-container {
			--modal-actions-bottom: 10px;

			flex-direction: row;

			form {
				min-height: 100vh;
			}
		}
	}
</style>
