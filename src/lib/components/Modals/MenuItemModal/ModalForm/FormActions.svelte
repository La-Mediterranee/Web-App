<script lang="ts">
	import Button from 'svelty-material/components/Button/Button.svelte';
</script>

<div class="actions">
	<slot />
</div>

<style lang="scss">
	.actions {
		// height: var(--actions-height);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;

		padding: 0.4em;
		// margin: 0.6em 0.2em 0;
		margin: 0 0.2em;
		border-radius: 2em;
		box-shadow: 4px 7px 24px 0 rgb(0 0 0 / 31%);
		background: var(--top2);
		position: var(--modal-actions-position, sticky);
	}

	@media screen and (min-width: 340px) {
		.actions {
			justify-content: space-between;
		}
	}

	$modalBP: 850px;

	@media screen and (min-width: 450px) {
		.actions {
			padding: 0.6em;
		}
	}

	@media screen and (min-width: $modalBP) {
		.actions {
			bottom: var(--modal-actions-bottom, 0);
		}
	}
</style>
