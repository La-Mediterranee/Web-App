<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
	<slot />
</label>

<style lang="scss">
	label {
		display: flex;
		align-items: center;
		cursor: pointer;

		width: 100%;
		height: 100%;
		font-size: 1.2em;
		padding: 0.6em 0;
		padding-inline-start: 0.5em;
		flex: 1;
	}
</style>
