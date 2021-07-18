<script>
	import CreditCard from '../../CreditCard';
	import { fetchFromAPI } from '$utils/helpers';
	import { auth, db } from '$firebase';

	// Handle the submission of card details
	const handleSubmit = async (event) => {
		event.preventDefault();

		const cardElement = elements.getElement(CardElement);

		// Confirm Card Setup
		const { setupIntent: updatedSetupIntent, error } = await stripe.confirmCardSetup(
			setupIntent.client_secret,
			{
				payment_method: { card: cardElement }
			}
		);

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

<form on:submit|preventDeafult={handleSubmit}>
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
	<SignOut {user} />
</div>

<style>
	/* your styles go here */
</style>
