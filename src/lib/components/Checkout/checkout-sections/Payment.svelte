<script lang="ts">
	import TextField from '$material/components/TextField';
	import ExpansionPanel from '$material/components/ExpansionPanels/ExpansionPanel.svelte';
	import ExpansionPanels from '$material/components/ExpansionPanels/ExpansionPanels.svelte';

	type PaymentMethods = 'credit' | 'sofort' | 'bar';

	export let value: number[] = [1];
	export let currentValue = 1;

	let sum = 0;
	let selected: HTMLFieldSetElement | null = null;
	let paymentMethod: PaymentMethods = 'credit';

	const name = 'Zahlungsmethode';
</script>

<section>
	<h3>Trinkgeld hinzufügen</h3>
	<form action="" method="POST">
		<button>
			<div>5%</div>
			<div>{sum * 0.05}</div>
		</button>
		<button>
			<div>10%</div>
			<div>{sum * 0.1}</div>
		</button>
		<button>
			<div>15%</div>
			<div>{sum * 0.15}</div>
		</button>
		<button>
			<div>Keines</div>
		</button>
	</form>
</section>

<section>
	<h3>Zahlung</h3>
	<form>
		<fieldset bind:this={selected}>
			<legend class="visually-hidden">Zahlungmethode</legend>

			<input
				bind:group={paymentMethod}
				type="radio"
				id="credit"
				value="credit"
				{name}
			/>
			<label for="credit">Kreditkarte</label>
			<br />

			<input
				bind:group={paymentMethod}
				type="radio"
				id="bar"
				value="bar"
				{name}
			/>
			<label for="bar">Barzahlung</label><br />

			<input
				bind:group={paymentMethod}
				type="radio"
				id="sofort"
				value="sofort"
				{name}
			/>
			<label for="sofort">Sofort Überweisung</label>
		</fieldset>
	</form>
</section>
<button
	type="button"
	on:click={() => {
		value = [0];
		currentValue = 0;
	}}
>
	Zurück zu den Lieferdetails
</button>
<button type="button" on:click={() => (value = [2])}>
	Weiter zur Zusammenfassung
</button>
