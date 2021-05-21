<script lang="ts">
	// let isActive: boolean;
	// dots.forEach((_, index) => {
	// 	if (!infinite) {
	// 		const maximumNextSlide = childrenArr.length - slidesToShow;
	// 		const possibileNextSlides = index * slidesToSlide!;
	// 		const isAboutToOverSlide = possibileNextSlides > maximumNextSlide;
	// 		nextSlide = isAboutToOverSlide ? maximumNextSlide : possibileNextSlides;
	// 		isActive =
	// 			nextSlide === currentSlide ||
	// 			(currentSlide > nextSlide &&
	// 				currentSlide < nextSlide + slidesToSlide! &&
	// 				currentSlide < childrenArr.length - slidesToShow);
	// 	} else {
	// 		nextSlide = nextSlidesTable[index];
	// 		const cloneIndex = lookupTable[nextSlide];
	// 		isActive =
	// 			currentSlides === cloneIndex ||
	// 			(currentSlides >= cloneIndex && currentSlides < cloneIndex + slidesToSlide!);
	// 	}
	// });

	import {
		CarouselInternalState,
		CarouselProps,
		StateCallBack,
		SkipCallbackOptions,
	} from './types';
	import { getOriginalIndexLookupTableByClones } from './utils/clones';
	import { getLookupTableForNextSlides } from './utils/dots';
	import { getSlidesToSlide } from './utils/common';

	import { Dot } from './Dot';

	// export let showDots;
	// export let customDot;
	// export let dotListClass;
	// export let infinite;
	// export let children;
	export let state: CarouselInternalState;
	export let props: CarouselProps;
	export let getState: () => StateCallBack;
	export let goToSlide: (index: number, skipCallbacks?: SkipCallbackOptions) => void;

	const { dotListClass, infinite, children } = props;
	const { currentSlide, slidesToShow } = state;
	// let DotList: HTMLUListElement;

	const childrenArr = children;
	const slidesToSlide = getSlidesToSlide(state, props);

	// let numberOfDotsToShow: number;
	// if (!infinite) {
	// 	numberOfDotsToShow = Math.ceil((childrenArr.length - slidesToShow) / slidesToSlide!) + 1;
	// } else {
	// 	numberOfDotsToShow = Math.ceil(childrenArr.length / slidesToSlide!);
	// }

	const numberOfDotsToShow: number = !infinite
		? Math.ceil((childrenArr.length - slidesToShow) / slidesToSlide!) + 1
		: Math.ceil(childrenArr.length / slidesToSlide!);

	const nextSlidesTable = getLookupTableForNextSlides(
		numberOfDotsToShow,
		state,
		props,
		childrenArr
	);

	const lookupTable = getOriginalIndexLookupTableByClones(slidesToShow, childrenArr);
	const currentSlides = lookupTable[currentSlide];
	const carouselState = getState();
	const dots = Array(numberOfDotsToShow).fill(0);

	let isActive: number;
	let nextSlide: number;

	if (!infinite) {
		dots.forEach((_, index) => {
			const maximumNextSlide = childrenArr.length - slidesToShow;
			const possibileNextSlides = index * slidesToSlide!;
			const isAboutToOverSlide = possibileNextSlides > maximumNextSlide;
			nextSlide = isAboutToOverSlide ? maximumNextSlide : possibileNextSlides;
			isActive =
				(nextSlide === currentSlide ||
					(currentSlide > nextSlide &&
						currentSlide < nextSlide + slidesToSlide! &&
						currentSlide < childrenArr.length - slidesToShow)) &&
				index;
		});
	} else {
		dots.forEach((_, index) => {
			nextSlide = nextSlidesTable[index];
			const cloneIndex = lookupTable[nextSlide];
			isActive =
				(currentSlides === cloneIndex ||
					(currentSlides >= cloneIndex && currentSlides < cloneIndex + slidesToSlide!)) &&
				index;
		});
	}
</script>

<ul class={`multi-carousel-dot-list ${dotListClass}`}>
	<!--bind:this={DotList}-->
	{#each dots as _, index}
		<slot
			{index}
			{carouselState}
			goToSlide={() => goToSlide(nextSlide)}
			isActive={isActive === index}
		>
			<Dot {index} goToSlide={() => goToSlide(nextSlide)} isActive={isActive === index} />
		</slot>
	{/each}
</ul>
<!-- {#if showDots || enoughChildren(state.slidesToShow, state.totalItems)}
{/if} -->
