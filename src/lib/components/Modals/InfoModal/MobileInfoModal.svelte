<script lang="ts">
	import Dialog from 'svelty-material/components/Dialog';

	import InfoModal from './InfoModal.svelte';

	import { onDestroy } from 'svelte';
	import { fade, scale, type EasingFunction, type TransitionConfig } from 'svelte/transition';

	import type { MenuItem } from 'types/product';

	export let menuitem: MenuItem;
	export let active: boolean;
	export let translations: TranslationFunctions['product'];

	let animationDuration = 500;

	function infoMqHandler(e: MediaQueryListEvent) {
		animationDuration = e.matches ? 300 : 500;
	}

	const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: no-preference)');
	const infoMqDestroy = initInfoMq(reducedMotionMq);

	if (reducedMotionMq.matches) {
		reducedAnimation = undefined;
		infoAnimation = () => ({ duration: infoAnimationDuration });
	} else {
		infoAnimation = fade;
		reducedAnimation = fade;
	}

	onDestroy(() => {
		infoMq.removeEventListener('change', infoMqHandler);
	});

	// your script goes here
</script>

<div id="info-container" style="--overlay-z-index: 2; --animation-duration:{animationDuration}">
	<Dialog
		id="info-dialog"
		role="dialog"
		width="100%"
		style="--theme-surface: transparent"
		inTransition={infoAnimation}
		outTransition={infoAnimation}
		{active}
		on:escape
		on:overlay-click
	>
		<InfoModal on:close {menuitem} {translations} />
	</Dialog>
</div>

<style lang="scss" global>
	#info-dialog {
		z-index: 3;
	}

	#menu-item-dialog-container {
		--s-dialog-content-overflow: visible;
	}

	#info-container {
		height: 100%;

		@media screen and (max-width: 960px) {
			--s-dialog-width: 100%;

			& .s-dialog__container {
				justify-content: unset;
				align-items: unset;
			}

			& #info-dialog {
				position: absolute;
				// margin: 0 auto;
				width: 100%;
				bottom: 0;
				transform: translateY(100%);
				transition: transform var(--animation-duration) ease-out;
			}

			& .active #info-dialog {
				transform: translateY(0);
				transition: transform var(--animation-duration) ease-in;
			}
		}
	}

	.s-dialog__content {
		margin: 12px 0 0;
		box-shadow: none;
		/* margin: 0; */
	}
</style>
