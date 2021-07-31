<script lang="ts">
	import Summary from './Summary.svelte';
	import Details from './checkout-sections/Details.svelte';
	import Payment from './checkout-sections/Payment.svelte';
	import ExpansionPanel from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from 'svelte-material-components/src/components/ExpansionPanels/ExpansionPanels.svelte';

	import type { User } from '@firebase/auth';

	let user: User;
	let value = [0];
	let currentValue = 0;

	$: value = value.length === 0 ? [currentValue] : value;

	const panels = [
		{
			id: 0,
			header: '1. Lieferdetails',
			component: Details,
		},
		{
			id: 1,
			header: '2. Zahlungdetails',
			component: Payment,
		},
		{
			id: 2,
			header: '3. Zusammenfassung',
			component: Summary,
		},
	];
</script>

<h1>Checkout</h1>

<div id="checkout" data-user={user}>
	<Summary />
	<div data-current={currentValue}>
		<ExpansionPanels bind:value>
			{#each panels as panel, i (panel.id)}
				<ExpansionPanel disabled={i !== value[0]}>
					<span slot="header">{panel.header}</span>
					<svelte:component
						this={panel.component}
						bind:value
						bind:currentValue
					/>
				</ExpansionPanel>
			{/each}
		</ExpansionPanels>
	</div>
</div>

<style lang="scss">
	@use "variables" as *;

	h1 {
		text-align: center;
	}

	#checkout {
		padding: 1em;
		display: block;
		max-width: 40em;
		margin: 0 auto;

		* {
			color: #ddd;
		}

		div {
			margin-top: 1em;
		}

		@media screen and (min-width: $md) {
			padding: 3em;
			display: flex;
			flex-direction: row-reverse;
			max-width: 78em;

			div {
				margin-top: 0;
				margin-right: 1em;
			}
		}
	}
</style>
