<script context="module">
	import Ripple from 'svelty-material/actions/Ripple';
</script>

<script lang="ts">
	export let ctaEl: HTMLDivElement;
</script>

<footer class="actionsContainer" aria-hidden="true">
	<slot name="prepend" />

	<div class="card-actions">
		<div
			bind:this={ctaEl}
			use:Ripple
			class="cta s-btn size-default rounded s-ripple-container form-elements-color"
		>
			<span class="s-btn__content add-to-cart-text" aria-hidden="true">
				<slot />
			</span>
		</div>
	</div>
</footer>

<style lang="scss">
	.actionsContainer {
		width: 100%;
		padding-top: 2em;
		position: relative;
		overflow: hidden;
		border-bottom-left-radius: var(--theme-card-border-radius);
		border-bottom-right-radius: var(--theme-card-border-radius);
		color: #278cc5;

		:global(.s-btn__content) {
			height: 100%;
		}
	}

	.card-actions {
		display: flex;
		padding: 0.7em 0;
		opacity: 1;
		z-index: 5;
		max-width: 100%;
	}

	.cta {
		cursor: pointer;
		margin: 0 auto;
	}

	.s-btn .add-to-cart-text {
		color: #fff;
		font-weight: 700;
		font-size: 1.3em;
		letter-spacing: 0.05em;
	}

	@media (any-hover: hover) and (pointer: fine) {
		.actionsContainer {
			left: 0;
			bottom: 0;
			position: absolute;
			will-change: transform;

			transform: translateY(110%);
			transition: transform var(--actions-transition-duration) ease;
			// padding-top: 4.2em;
		}

		:global(.menuitem-card-container:focus-within) .cta::before {
			opacity: var(--s-btn-focus-opacity, 0.14);
			transition-property: opacity;
			transition-delay: calc(var(--actions-transition-duration) * 0.7);
		}

		:global(.menuitem-card-container:focus-within) .actionsContainer,
		:global(.menuitem-card-container:hover) .actionsContainer {
			transform: translateY(0);
		}
	}
</style>
