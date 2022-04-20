<script context="module" lang="ts">
	import throttle from '$lib/utils/helper/throttle';
	import { createEventDispatcher } from 'svelte';

	import type { CustomerInfo } from 'types/customer';

	const enterkeyhint = 'next';
</script>

<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';
	import TextField from 'svelty-material/components/TextField/TextField.svelte';

	export let customer: CustomerInfo;
	export let translations: TranslationFunctions['checkout']['deliveryDetails'];

	const dispatch = createEventDispatcher();
</script>

<!-- ./checkout?next=payment -->
<!-- ={e => dispatch('submit', e)} -->
<form
	novalidate
	class="delivery-section"
	action="./checkout?next=1"
	method="post"
	on:submit|preventDefault
>
	<fieldset>
		<legend>{translations.userInfo.title()}</legend>
		<div>
			<TextField
				bind:value={customer.email}
				{enterkeyhint}
				type="email"
				name="email"
				autocomplete="email"
				required
				rounded
				filled
			>
				{translations.userInfo.email()}
			</TextField>
			<TextField
				bind:value={customer.number}
				{enterkeyhint}
				type="tel"
				name="tel"
				autocomplete="tel"
				required
				rounded
				filled
			>
				{translations.userInfo.phone()}
			</TextField>
		</div>
		<div>
			<TextField
				bind:value={customer.name}
				{enterkeyhint}
				name="name"
				autocomplete="given-name"
				required
				rounded
				filled
			>
				{translations.userInfo.name()}
			</TextField>
			<TextField
				bind:value={customer.surname}
				{enterkeyhint}
				name="surname"
				autocomplete="family-name"
				required
				rounded
				filled
			>
				{translations.userInfo.surname()}
			</TextField>
		</div>
	</fieldset>
	<fieldset>
		<legend>{translations.deliveryInfo.title()}</legend>
		<div>
			<TextField
				bind:value={customer.address}
				{enterkeyhint}
				name="address"
				autocomplete="street-address"
				required
				filled
				rounded
			>
				{translations.deliveryInfo.street()}
			</TextField>
		</div>
		<div>
			<TextField
				bind:value={customer.postalCode}
				{enterkeyhint}
				name="postalCode"
				autocomplete="postal-code"
				required
				filled
				rounded
			>
				{translations.deliveryInfo.postalCode()}
			</TextField>
			<TextField
				bind:value={customer.city}
				enterkeyhint="done"
				name="city"
				autocomplete="address-level2"
				required
				filled
				rounded
			>
				{translations.deliveryInfo.city()}
			</TextField>
		</div>
	</fieldset>
	<div class="actions">
		<Button type="submit" class="form-elements-color" rounded>
			<span style="font-weight: bold; font-size: 1.1em">
				{translations.next()}
			</span>
		</Button>
	</div>
</form>

<style src="./Details.scss" lang="scss">
</style>
