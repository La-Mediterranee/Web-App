<script lang="ts">
	import { CarouselInternalState, CarouselProps, SkipCallbackOptions } from './types';
	import { getInitialState, getIfSlideIsVisbile } from './utils';

	type goToSlide = (index: number, skipCallbacks?: SkipCallbackOptions) => void;

	let itemClass;
	export let itemWidth;
	export let infinite: boolean;
	export { itemClass as class };
	export let itemAriaLabel: string;
	export let partialVisible;

	export let props: CarouselProps;
	export let state: CarouselInternalState;
	export let goToSlide: goToSlide;
	export let clones: any[];
	export let notEnoughChildren: boolean;

	const {
		flexBisis,
		shouldRenderOnSSR,
		domFullyLoaded,
		partialVisibilityGutter,
		shouldRenderAtAll,
	} = getInitialState(state, props);
</script>

{#if !shouldRenderAtAll}
	{#if infinite}
		{clones}
	{:else}
		<div
			data-index={index}
			aria-hidden={getIfSlideIsVisbile(index, state) ? 'false' : 'true'}
			aria-label={itemAriaLabel ? itemAriaLabel : ariaLabel ? ariaLabel : null}
			style={{
				flex: shouldRenderOnSSR ? `1 0 ${flexBisis}%` : 'auto',
				position: 'relative',
				width: domFullyLoaded
					? `${
							// old wrongly spelt partialVisbile prop kept to not make changes breaking
							partialVisible && partialVisibilityGutter && !notEnoughChildren
								? itemWidth - partialVisibilityGutter
								: itemWidth
					  }px`
					: 'auto',
			}}
			class={`carousel-item ${
				getIfSlideIsVisbile(index, state) ? 'carousel-item--active' : ''
			} ${itemClass}`}
			on:click={() => {
				if (focusOnSelect) {
					goToSlide(index);
				}
			}}
		>
			<slot />
		</div>
	{/if}
{/if}

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
