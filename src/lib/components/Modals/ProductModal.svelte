<svelte:options immutable />

<script context="module" lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { mdiClose, mdiInformation } from '@mdi/js';

	import type { Product, Variations } from 'types/product';

	const AmountLabel = 'Menge';

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

	import RadioButton from '$components/Forms/RadioButton.svelte';

	export let product: Product;
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';
	// export let close: () => void = () => {};
	let quantitiy = 1;
	let valid = false;

	const dispatch = createEventDispatcher();

	const { variations, price, description, name, image } = product;

	const _price = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(price);

	const addToCartBtnText = 'Zum Warenkorb hinzufügen';

	function close() {
		dispatch('close');
	}
</script>

<div class="container">
	<aside>
		<div class="sidebar-container">
			<img src={image.src} alt={image.alt} />
			<header class="info">
				<div class="header">
					<slot name="title">
						<h1 class="title">{name}</h1>
					</slot>
					<span class="price">
						<data value={`${price}`}>{_price}</data>
					</span>
				</div>
				<p class="description">
					{description || ''}
				</p>
			</header>
		</div>
	</aside>
	<form
		id="product-modal"
		action="/add-to-cart"
		on:change={e => console.log((valid = e.currentTarget.checkValidity()))}
		on:submit|preventDefault={e => addToCart(e, variations)}
	>
		<h1 class="title">Customization</h1>

		<!-- <Button
			fab
			depressed
			size="small"
			style="position:absolute; top:0; right:1em; transform: translateY(-50%); background: var(--theme-surface)"
			on:click={close}
		>
			<Icon path={mdiClose} />
		</Button> -->

		<div class="toppings">
			{#each variations?.toppings || [] as topping}
				<fieldset class="topping">
					<legend>{topping}</legend>

					{#each ['Kraken', 'Sasquatch', 'Mothman'] as item}
						{@const id = `${topping}-${item}`.toLowerCase()}
						<div class="topping-item">
							<label for={id}>
								<RadioButton {id} name={topping} value={item} required />
								<img width="70" src="/burger.png" alt="" role="presentation" />
								<span class="input-label">
									{item}
								</span>
							</label>
							<!-- style="color: var(--accent-color, orange); background-color: white;" -->
							<Button icon type="button" on:click={() => console.log('Hi')}>
								<Icon path={mdiInformation} />
							</Button>
						</div>
					{/each}
				</fieldset>
			{/each}
		</div>

		<div class="actions">
			<div>
				<Button
					size="small"
					disabled={quantitiy <= 1 || quantitiy == null}
					fab
					on:click={() => quantitiy--}
				>
					-
				</Button>
				<label for="amount" class="visually-hidden">{AmountLabel}</label>
				<input
					id="amount"
					type="number"
					inputmode="numeric"
					bind:value={quantitiy}
					min="1"
				/>
				<Button size="small" fab on:click={() => quantitiy++}>+</Button>
			</div>

			<Button type="submit" class="form-elements-color" disabled={!valid} rounded>
				<span class="add-to-cart-text">{addToCartBtnText}</span>
			</Button>
		</div>
	</form>
</div>

<style lang="scss" global>
	.s-dialog__content {
		--s-dialog-content-overflow: visible;
		--s-dialog-justify-content: flex-start;
	}

	.container {
		--aside-width: 33.33%;
		--container-padding: 0.5em 1.2em;
		display: block;
	}

	.sidebar-container {
		padding: var(--container-padding);
	}

	aside {
		// background-color: var(--accent-color, orange);
		background: var(--top2);
		border-end-end-radius: 1em;

		img {
			height: auto;
			width: 100%;
		}
	}

	.title {
		font-size: 2em;
		margin: 0.6em 0 0.4em;
	}

	.price {
		font-size: 1.5em;
		font-weight: 500;
		padding-inline-start: 0.2em;
	}

	@media screen and (min-width: 700px) {
		.container {
			display: flex;
		}

		aside {
			flex: 0 0 var(--aside-width);
			max-width: var(--aside-width);
		}

		.title {
			font-size: 2.5em;
			text-align: center;
		}
	}

	#product-modal {
		accent-color: var(--accent-color, orange);
		// max-width: 42em;
		padding: var(--container-padding);
		color: #fff;
		flex: 0 0 calc(100% - var(--aside-width));

		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
		}

		.info {
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.toppings {
		}

		.topping {
			border: none;
			margin: 1em 0;
			padding: 0.4em 0;

			legend {
				font-size: 1.5em;
				font-weight: 600;
			}
		}

		.topping-item {
			display: flex;
			align-items: center;
			padding: 0 0.6em;

			&:hover {
				background: rgb(99, 165, 209);
				border-radius: 0.5em;
			}

			.info-button {
				margin-left: auto;
			}

			img {
				margin: 0 1em;
			}

			label {
				font-size: 1.2em;
				padding: 0.6em 0;
				padding-left: 0.5em;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
			}
		}

		.add-to-cart-text {
			color: #fff;
			font-size: 1.2em;
			font-weight: 600;
		}

		.actions {
			// z-index: 20;
			// position: fixed;
			// bottom: calc(var(--tab-bar-active-height) + 1em);
			// right: 120px;

			display: flex;
			align-items: center;
			justify-content: space-between;

			padding: 0.7em;
			border-radius: 2em;
			// background: #fff;
			box-shadow: 4px 7px 24px 0 rgb(0 0 0 / 31%);

			input {
				width: 3em;
				text-align: center;
				appearance: textfield;
			}
		}
	}
</style>
