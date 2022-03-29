<script context="module" lang="ts">
	import { setStripeContext } from '$lib/stores/stripe';

	const STRIPE_SCRIPT = `<script defer async src="https://js.stripe.com/v3/">${'<'}/script>`;
</script>

<script lang="ts">
	setStripeContext();
</script>

{@html STRIPE_SCRIPT}

<slot />
