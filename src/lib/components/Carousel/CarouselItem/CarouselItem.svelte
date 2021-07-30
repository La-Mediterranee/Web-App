<script lang="ts">
	import { SkipCallbackOptions } from '../types';

	export let child: any;
	export let goToSlide: (index: number, skipCallbacks?: SkipCallbackOptions) => void;
	export let index: number;
	export let width: string;
	export let visible: boolean;
	export let ariaLabel: string;
	export let flex: number | string | undefined;
	export let itemClass: string;
	export let focusOnSelect: boolean;
</script>

<div
	data-index={index}
	aria-hidden={visible ? 'false' : 'true'}
	aria-label={ariaLabel ? ariaLabel : child.ariaLabel ? child.ariaLabel : null}
	style={`flex: ${flex}; width: ${width}`}
	class={`carousel-item ${visible ? 'carousel-item--active' : ''} ${itemClass}`}
	on:click={() => {
		if (focusOnSelect) {
			goToSlide(index);
		}
	}}
>
	<slot {child} />
</div>

<style>
	.slider-item {
		width: 100%;
		z-index: 1;
		display: inline-block;
		position: relative;
		white-space: normal;
		vertical-align: top;
		padding: 0 2px;
	}
</style>
