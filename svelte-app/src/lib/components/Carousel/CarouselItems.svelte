<script lang="ts">
	import { CarouselItem } from './CarouselItem';
	import { CarouselInternalState, CarouselProps, SkipCallbackOptions } from './types';
	import { getInitialState, notEnoughChildren, getClones, getIfSlideIsVisbile } from './utils';

	export let props: CarouselProps;
	export let state: CarouselInternalState;
	export let goToSlide: (index: number, skipCallbacks?: SkipCallbackOptions) => void;

	const { itemWidth } = state;
	const { children, infinite, itemClass, itemAriaLabel, partialVisible, focusOnSelect } = props;

	const {
		shouldRenderAtAll,
		domFullyLoaded,
		partialVisibilityGutter,
		flexBasis,
		shouldRenderOnSSR,
	} = getInitialState(state, props);

	let clones = [];

	if (infinite) {
		const childrenArr = props.children;
		clones = getClones(state.slidesToShow, childrenArr);
	}

	const calcItemWidth = domFullyLoaded
		? `${
				partialVisible && partialVisibilityGutter && !notEnoughChildren
					? itemWidth - partialVisibilityGutter
					: itemWidth
		  }px`
		: 'auto';

	const itemFlex = shouldRenderOnSSR ? `1 0 ${flexBasis}%` : 'auto';
</script>

{#if shouldRenderAtAll}
	{#if infinite}
		{clones}
	{:else}
		{#each children as child, index}
			<CarouselItem
				{child}
				{index}
				{goToSlide}
				{itemClass}
				{focusOnSelect}
				ariaLabel={itemAriaLabel}
				width={calcItemWidth}
				flex={itemFlex}
				visible={getIfSlideIsVisbile(index, state)}
			/>
		{/each}
	{/if}
{/if}
