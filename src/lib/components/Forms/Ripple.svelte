<script>
	// your script goes here
</script>

<span class="ripple">
	<span class="ripple-element" />
</span>

<style lang="scss">
	.ripple {
		--_ripple-size: 40px;
		--_ripple-position: calc(50% - calc(var(--_ripple-size) / 2));

		position: absolute;
		left: var(--_ripple-position);
		top: var(--_ripple-position);
		height: var(--_ripple-size);
		width: var(--_ripple-size);
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
		transform: translateZ(0);

		&-element {
			position: absolute;
			border-radius: 50%;
			pointer-events: none;
			transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);

			display: block;
			width: 100%;
			height: 100%;
			transform: none;
			opacity: 0;
			// background-color: #fff;
			background-color: currentColor;
		}
	}
</style>
