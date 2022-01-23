<div class="item">
	<slot />
</div>

<style lang="scss">
	.item {
		$snap-margin: 0 2em;
		padding: var(--siema-item-padding, 0 0.625em);
		margin: var(--siema-item-margin, 0.5em 0);
		// margin-inline-start: 0.5rem;
		// margin-inline-end: 0.5rem;
		min-width: var(--siema-item-width, 100%);
		max-width: var(--siema-item-max-width, 100%);
		// width: var(--siema-item-width, 100%);
		// min-width: var(--siema-item-min-width);

		scroll-snap-align: var(--siema-scroll-snap-align, center);

		@supports (scroll-margin: 0) or (scroll-snap-margin: 0) {
			scroll-margin: $snap-margin;
			scroll-snap-margin: $snap-margin;
		}

		&:first-child {
			padding-inline-start: 0;
		}
	}
</style>
