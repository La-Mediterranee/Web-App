<!-- svelte-ignore a11y-no-redundant-roles -->
<table role="table">
	<slot />
</table>

<style lang="scss">
	table {
		display: grid;
		gap: 1em;
		grid-template-columns: 1fr;
		border-radius: 1rem;
		border-spacing: 0 1em;
		width: 100%;

		position: relative;
		justify-content: center;
		align-items: center;
		max-width: 100%;
	}

	@media screen and (min-width: 960px) {
		table {
			flex: 1 0 58%;
			max-width: 58%;
			align-self: flex-start;
		}
	}

	@media screen and (min-width: 1060px) {
		table {
			flex: 1 0 60%;
			max-width: 60%;
		}
	}
</style>
