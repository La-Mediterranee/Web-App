<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';

	import { fetchFromAPI } from '$lib/utils/helper';
	import { STRIPE_PUBLIC_KEY } from '$lib/utils/constants';
	import CreditCard from '$components/CreditCard';

	import type { User } from 'firebase/auth';
	import type {
		StripeCardElement,
		StripeElements,
		Stripe,
		SetupIntent,
	} from '@stripe/stripe-js';

	interface PaymentSource {
		id: string;
		card: string;
	}

	let complete = false;
	let wallet: PaymentSource[] = [];
	let stripe: Stripe | null = null;
	let customer: User; // Firebase user
	let setupIntent: SetupIntent | undefined;
	let card: HTMLElement;
	let elements: StripeElements;
	let cardElement: StripeCardElement;

	onMount(async () => {
		try {
			stripe = await loadStripe(STRIPE_PUBLIC_KEY);
		} catch (error) {
			console.error((error as Error).message);
		}
	});

	$: getWallet(customer);
	$: hasSetupIntent = setupIntent ? true : false;

	function createAddPayment() {
		if (stripe) {
			elements = stripe.elements();

			cardElement = elements.create('card');
			cardElement.mount(card);
			cardElement.on('change', e => (complete = e.complete));
		}
	}

	async function handleSubmit(_e: Event) {
		// Confirm Card Setup

		if (!setupIntent?.client_secret) return;

		const { setupIntent: updatedSetupIntent, error } =
			(await stripe?.confirmCardSetup(setupIntent.client_secret, {
				payment_method: { card: cardElement },
			})) || {};

		if (error) {
			alert(error.message);
			console.log(error);
		} else {
			setupIntent = updatedSetupIntent;
			await getWallet();
			alert('Success! Card added to your wallet');
		}
	}

	async function createSetupIntent(_e: MouseEvent): Promise<void> {
		setupIntent = await fetchFromAPI('wallet');
	}

	async function getWallet(customer?: any): Promise<void> {
		if (customer) {
			wallet = await fetchFromAPI('wallet', { method: 'GET' });
		}
	}
</script>

{#if customer}
	<h1>Deine Zahlungsmittel</h1>

	{#each wallet as paymentSource (paymentSource.id)}
		<CreditCard card={paymentSource.card} />
	{:else}
		<h2>😱 Du hast noch kein Zahlungsmittel gespeichert.</h2>
	{/each}

	<div>
		<button on:click={createSetupIntent} hidden={hasSetupIntent}>
			Zahlungsmethode hinzufügen
		</button>
	</div>

	<hr />

	{#if hasSetupIntent}
		<form on:submit|preventDefault={handleSubmit}>
			<div class="elements" bind:this={card} />
			<button> Bestätigen </button>
		</form>
	{/if}
{/if}

<style>
	/* your styles go here */
</style>
