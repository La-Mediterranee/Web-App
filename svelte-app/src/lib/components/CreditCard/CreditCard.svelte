<script>
	export let card;
	const { brand, last4, exp_month, exp_year } = card;
</script>

<option>
	{brand} **** **** **** {last4} expires {exp_month}/{exp_year}
</option>

<style>
	/* your styles go here */
</style>
