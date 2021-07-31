<script lang="ts">
	import TextField from 'svelte-material-components/src/components/TextField';

	export let value: number[];
	export let currentValue = 0;

	let customerInfo: HTMLFormElement | null = null;
	let street: string = '';
	let city: string = '';

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
	bind:this={customerInfo}
	on:submit|preventDefault={checkOrderDeatils}
>
	<fieldset>
		<legend>Kontaktinformation:</legend>
		<div>
			<TextField
				type="email"
				name="email"
				autocomplete="email"
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
				required
				rounded
				outlined
			>
				Vorname
			</TextField>
			<TextField
				name="surname"
				autocomplete="family-name"
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
				required
				outlined
				rounded
			>
				Straße und Hausnummer
			</TextField>
		</div>
		<div>
			<TextField
				name="zip"
				autocomplete="postal-code"
				required
				outlined
				rounded
			>
				PLZ
			</TextField>
			<TextField
				name="city"
				autocomplete="address-level2"
				required
				outlined
				rounded
			>
				Stadt
			</TextField>
		</div>
	</fieldset>
	<button> Weiter zur Zahlung </button>
</form>

<style src="./Details.scss" lang="scss">
</style>
