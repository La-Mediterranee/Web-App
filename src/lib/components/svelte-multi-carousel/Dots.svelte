<script lang="ts">
	export let showDots;
	export let customDot;
	export let dotListClass;
	export let infinite;
	export let children;

	import {
		CarouselInternalState,
		CarouselProps,
		StateCallBack,
		SkipCallbackOptions,
	} from './types';
	import { getOriginalIndexLookupTableByClones } from './utils/clones';
	import { getLookupTableForNextSlides } from './utils/dots';
	import { getSlidesToSlide, enoughChildren } from './utils/common';

	let DotList: HTMLUListElement;

	const childrenArr = Array.from(DotList.querySelectorAll('.multi-carousel-dot'));

	let numberOfDotsToShow: number;
	if (!infinite) {
		numberOfDotsToShow = Math.ceil((childrenArr.length - slidesToShow) / slidesToSlide!) + 1;
	} else {
		numberOfDotsToShow = Math.ceil(childrenArr.length / slidesToSlide!);
	}

	const nextSlidesTable = getLookupTableForNextSlides(
		numberOfDotsToShow,
		state,
		props,
		childrenArr
	);

	const lookupTable = getOriginalIndexLookupTableByClones(slidesToShow, childrenArr);
</script>

{#if showDots || enoughChildren(state)}
	<ul className={`multi-carousel-dot-list ${dotListClass}`} bind:this={DotList}>
		{#each Array(numberOfDotsToShow).fill(0) as item, index}
			<slot name="customDot" {index} {goToSlide}>
				<li class={`multi-carousel-dot ${isActive ? 'multi-carousel-dot--active' : ''}`}>
					<button
						aria-label={`Go to slide ${index + 1}`}
						on:click={() => goToSlide(nextSlide)}
					/>
				</li>
			</slot>
		{/each}
	</ul>
{/if}
