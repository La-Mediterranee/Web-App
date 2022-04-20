<svelte:options immutable />

<script context="module" lang="ts">
	import CloseBtn from '$lib/components/Buttons/CloseBtn.svelte';

	import ModalForm from './ModalForm/ModalForm.svelte';
	import ModalAside from './ModalAside/ModalAside.svelte';
	import ItemDesc from './ModalAside/ItemDesc.svelte';

	import { createEventDispatcher, onMount } from 'svelte';

	import { formatPrice } from '$lib/stores/cart';

	import type { MenuItem, Topping } from 'types/product';
	import { getModalContext } from '..';

	export type AddToCart = typeof addToCart;

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
	export let menuitem: MenuItem;
	export let locale: string = 'de-DE';

	let quantitiy = 1;
	let valid = false;

	const { toppings, price } = menuitem;

	const dispatch = createEventDispatcher();

	const modal = getModalContext();

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

	const close = () => dispatch('close');
</script>

<div class="product-modal-container">
	<CloseBtn class="form-elements-color" on:click={close} />
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
		on:info={() => modal.openInfoModal(menuitem)}
		on:change={checkIfValid}
		on:submit={e => addToCart(e, menuitem.toppings)}
		on:close={close}
	>
		<h1 slot="title">Customization</h1>
	</ModalForm>
</div>

<style lang="scss" global>
	.product-modal-container {
		--aside-width: 33.33%;
		--container-padding: 1.5em 0.8em 1.2em;
		display: block;
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		// background-color: var(--theme-surface);

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
