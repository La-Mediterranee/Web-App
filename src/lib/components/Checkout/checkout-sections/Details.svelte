<script lang="ts">
	import Button from 'svelte-material-components/src/components/Button/Button.svelte';

	import TextField from 'svelte-material-components/src/components/TextField';
	import type { CustomerInfo } from '../Checkout.svelte';

	export let value: number[];
	export let currentValue = 0;
	export let customer: CustomerInfo;

	function checkOrderDeatils(e: Event) {
		const form = e.currentTarget as HTMLFormElement;
		console.log(form.elements);
		value = [1];
		currentValue = 1;
	}
</script>

<form
	novalidate
	action="/checkout-info"
	on:submit|preventDefault={checkOrderDeatils}
>
	<fieldset>
		<legend>Kontaktinformation:</legend>
		<div>
			<TextField
				type="email"
				name="email"
				autocomplete="email"
				bind:value={customer.email}
				required
				rounded
				outlined
			>
				E-mail
			</TextField>
			<TextField
				type="tel"
				name="tel"
				autocomplete="tel"
				bind:value={customer.number}
				required
				rounded
				outlined
			>
				Telefonnummer
			</TextField>
		</div>
		<div>
			<TextField
				name="name"
				autocomplete="given-name"
				bind:value={customer.name}
				required
				rounded
				outlined
			>
				Vorname
			</TextField>
			<TextField
				name="surname"
				autocomplete="family-name"
				bind:value={customer.surname}
				required
				rounded
				outlined
			>
				Nachname
			</TextField>
		</div>
	</fieldset>
	<fieldset>
		<legend>Lieferadresse:</legend>
		<div>
			<TextField
				name="address"
				autocomplete="street-address"
				bind:value={customer.address}
				required
				outlined
				rounded
			>
				Straße und Hausnummer
			</TextField>
		</div>
		<div>
			<TextField
				name="postalCode"
				autocomplete="postal-code"
				bind:value={customer.postalCode}
				required
				outlined
				rounded
			>
				PLZ
			</TextField>
			<TextField
				name="city"
				autocomplete="address-level2"
				bind:value={customer.city}
				required
				outlined
				rounded
			>
				Stadt
			</TextField>
		</div>
	</fieldset>
	<div class="actions">
		<Button type="submit" class="orange darken-1" rounded>
			Weiter zur Zahlung
		</Button>
	</div>
</form>

<style src="./Details.scss" lang="scss">
</style>
