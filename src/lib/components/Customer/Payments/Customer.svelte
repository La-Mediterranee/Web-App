<script lang="ts">
	//@ts-nocheck
	import CreditCard from '$components/CreditCard/CreditCardPlaceholder.svelte';
	import SignOut from '$components/Buttons/SignOut.svelte';
	import { fetchFromAPI, getStripeContext } from '$lib/utils/helper';
	import { getAuthContext } from '$lib/firebase/helpers';

	import type { SetupIntent } from '@stripe/stripe-js';
	export let wallet: [];

	const user = getAuthContext();
	const stripe = getStripeContext();

	async function getWallet() {}

	function setSetupIntent(intent: SetupIntent | undefined) {}

	function createSetupIntent(e: Event) {}

	// Handle the submission of card details
	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const cardElement = elements.getElement(CardElement);

		// Confirm Card Setup
		const { setupIntent: updatedSetupIntent, error } =
			(await $stripe?.confirmCardSetup(setupIntent.client_secret, {
				payment_method: { card: cardElement },
			})) || {};

		if (error) {
			alert(error.message);
			console.log(error);
		} else {
			setSetupIntent(updatedSetupIntent);
			await getWallet();
			alert('Success! Card added to your wallet');
		}
	};
</script>

<div>
	<button on:click={createSetupIntent} hidden={setupIntent}> Neue Zahlungsart hinzufügen </button>
</div>
<hr />

<form on:submit|preventDefault={handleSubmit}>
	<button type="submit"> Attach </button>
</form>

<div>
	<h3>Retrieve all Payment Sources</h3>
	<select>
		{#each wallet as paymentSource (paymentSource.id)}
			<CreditCard card={paymentSource.card} />
		{/each}
	</select>
</div>
<div>
	<SignOut on:click={user.logOut} />
</div>

<style>
	/* your styles go here */
</style>
