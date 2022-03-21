<a href="#main-start" class="skip-main">
	<slot />
</a>

<style lang="scss">
	.skip-main {
		padding: 8px;
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		transform: translateY(-100%);
		background: var(--theme-app-bar);

		z-index: 101;

		&:focus {
			transform: translateY(0);
		}
	}
</style>
