<script>
	// your script goes here
</script>

<!-- markup (zero or more items) goes here -->
<style>
	.swipe-indicator {
		position: relative;
		bottom: 1.5rem;
		display: flex;
		justify-content: center;
		z-index: var(--slider-indicator, 2);
		pointer-events: none;
	}

	.swipe-indicator .is-active {
		background-color: var(--slider-indicator-active, grey);
	}

	.dot {
		height: 10px;
		width: 10px;
		background-color: transparent;
		border: 1px solid grey;
		border-radius: 50%;
		display: inline-block;
		margin: 0px 2px;
		cursor: pointer;
		pointer-events: fill;
	}
</style>
