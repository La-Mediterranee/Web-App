<div class="topping-option">
	<slot />
</div>

<style lang="scss">
	$modalBP: 850px;

	.topping-option {
		--radio-hover-opacity: 0;
		--checkbox-hover-opacity: 0;

		display: flex;
		align-items: center;
		// padding: 0 0.6em;
		flex: 1 1 100%;
		padding-inline-end: 0.3em;
		flex-wrap: wrap;

		&:hover,
		&:focus-visible {
			background: rgb(99, 165, 209);
			border-radius: 0.5em;
		}

		@media screen and (min-width: $modalBP) {
			flex: 1 1 50%;
		}
	}
</style>
