<div class="payment-processor">
	<slot />
</div>

<style lang="scss">
	.payment-processor {
		display: flex;
		padding: 0.65em;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		min-height: 3.2em;

		padding: 0.65em;
		border-bottom: 2px solid;
		transition: height 1s ease-out;

		&:first-of-type {
			border-top: 0;
		}

		&:last-of-type {
			border-bottom: 0;
		}
	}
</style>
