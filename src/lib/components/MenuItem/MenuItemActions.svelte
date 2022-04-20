<script context="module">
	import Ripple from 'svelty-material/actions/Ripple';
	import Button from 'svelty-material/components/Button/Button.svelte';
</script>

<script lang="ts">
	export let ctaEl: HTMLDivElement | undefined = undefined;
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

		<!-- <Button class="form-elements-color" style="position: absolute; z-index: 6;">
			<slot />
		</Button> -->
	</div>

	<slot name="append" />
</footer>

<style lang="scss">
	.actionsContainer {
		width: 100%;
		padding-top: var(--menuitem-actions-pb-start, 2.2em);
		position: relative;
		// overflow: hidden;
		border-bottom-left-radius: var(--theme-card-border-radius);
		border-bottom-right-radius: var(--theme-card-border-radius);
		color: var(--wave-color);

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
		position: relative;
		align-items: center;
		justify-content: center;
		height: 4em;
		width: 100%;
	}

	.cta {
		cursor: pointer;
		// margin: 0 auto;
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
			transform: translateZ(0) translateY(110%);
			transition: transform var(--actions-transition-duration) ease;
			// padding-top: 4.2em;
		}

		// :global(.menuitem-card-container:focus-within) .cta:not(.click)::before {
		// 	opacity: var(--s-btn-focus-opacity, 0.14);
		// 	transition-property: opacity;
		// 	transition-delay: calc(var(--actions-transition-duration) * 0.7);
		// }

		:global(.menuitem-card-container:focus-within) .actionsContainer,
		:global(.menuitem-card-container:hover) .actionsContainer {
			transform: translateY(0);
		}
	}
</style>
