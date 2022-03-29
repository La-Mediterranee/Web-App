<script lang="ts">
	export let ariaHidden: boolean | undefined = undefined;
</script>

<li class="item" aria-hidden={ariaHidden}>
	<slot />
</li>

<style lang="scss">
	.item {
		flex: 1 0 var(--carousel-item-width, 100%);
		height: var(--carousel-item-height);
		width: var(--carousel-item-width, 100%);
		max-width: var(--carousel-item-max-width, 100%);
		// min-width: var(--carousel-item-min-width);
		// min-width: var(--carousel-item-width, 100%);

		scroll-snap-align: var(--carousel-scroll-snap-align);

		$padding-inline: 0.625em;
		padding: var(--carousel-item-padding, 0 #{$padding-inline});

		$margin-block: 0.5em;
		margin: var(--carousel-item-margin, #{$margin-block} 0);

		@supports (margin-inline: 0) {
			margin-inline: var(--carousel-item-margin-inline);
			margin-block: var(--carousel-item-margin-block, #{$margin-block});

			padding-inline: var(--carousel-item-margin-inline, #{$padding-inline});
			padding-block: var(--carousel-item-margin-block);
		}

		&:first-child {
			padding-inline-start: var(--carousel-item-first-pi-start, 0);
		}

		&:last-child {
			padding-inline-end: var(--carousel-item-last-pi-end, 0);
		}

		$snap-margin: 0;
		@supports (scroll-margin: 0) or (scroll-snap-margin: 0) {
			scroll-margin: var(--carousel-item-scroll-margin, $snap-margin);
			scroll-snap-margin: var(--carousel-item-scroll-margin, $snap-margin);
		}
	}
</style>
