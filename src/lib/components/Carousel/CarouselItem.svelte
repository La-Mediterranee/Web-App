<li class="item">
	<slot />
</li>

<style lang="scss">
	.item {
		padding: var(--carousel-item-padding, 0 0.625em);
		margin: var(--carousel-item-margin, 0.5em 0);
		// margin-inline-start: 0.5rem;
		// margin-inline-end: 0.5rem;
		flex: 1 0 var(--carousel-item-width, 100%);
		width: var(--carousel-item-width, 100%);
		// min-width: var(--carousel-item-width, 100%);

		max-width: var(--carousel-item-max-width, 100%);
		// width: var(--carousel-item-width, 100%);
		// min-width: var(--carousel-item-min-width);

		scroll-snap-align: var(--carousel-scroll-snap-align, start);

		&:first-child {
			padding-inline-start: 0;
		}

		&:last-child {
			padding-inline-end: 0;
		}

		$snap-margin: 0 0.4em;
		@supports (scroll-margin: 0) or (scroll-snap-margin: 0) {
			scroll-margin: var(--carousel-item-scroll-margin, $snap-margin);
			scroll-snap-margin: var(--carousel-item-scroll-margin, $snap-margin);
		}
	}
</style>
