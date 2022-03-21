<script context="module" lang="ts">
	import { setStripeContext } from '$lib/stores/stripe';

	const STRIPE_SCRIPT = `<script defer async src="https://js.stripe.com/v3/">${'<'}/script>`;
</script>

<script lang="ts">
	setStripeContext();
</script>

<svelte:head>
	{@html STRIPE_SCRIPT}
</svelte:head>

<slot />
