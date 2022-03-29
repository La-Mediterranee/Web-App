<div class="sidebar-container">
	<slot />
</div>

<style lang="scss">
	.sidebar-container {
		display: flex;
		flex-direction: column;
		padding: var(--container-padding);
		// overflow: auto;
	}
</style>
