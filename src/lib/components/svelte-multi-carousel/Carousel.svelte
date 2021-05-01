<script lang="ts">
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import {
		CarouselInternalState,
		CarouselProps,
		StateCallBack,
		Direction,
		isMouseMoveEvent,
		SkipCallbackOptions,
		ResponsiveType,
	} from './types';

	import {
		throttle,
		getClones,
		checkClonesPosition,
		getInitialState,
		throwError,
		getItemClientSideWidth,
		populateNextSlides,
		populatePreviousSlides,
		populateSlidesOnMouseTouchMove,
		isInLeftEnd,
		isInRightEnd,
		getInitialSlideInInfiniteMode,
		notEnoughChildren,
	} from './utils';

	import Dots from './Dots.svelte';
	import { LeftArrow, RightArrow } from './Arrows';
	import { getTransform } from './utils/common';
	import CarouselItem from './CarouselItem.svelte';

	export let responsive: ResponsiveType;
	export let deviceType: string;
	export let ssr: boolean;
	export let slidesToSlide = 1;
	export let draggable = true;
	export let arrows = true;
	export let renderArrowsWhenDisabled = false;
	export let swipeable = true;
	export let removeArrowOnDeviceType: string | Array<string>;
	export let infinite = false;
	export let minimumTouchDrag = 80;

	let className: string = '';
	export { className as class };
	// export let className:string ="";

	export let customTransition: string;
	export let transitionDuration: number;

	export let afterChange: (arg0: number, arg1: CarouselInternalState) => void;
	export let beforeChange: (arg0: number, arg1: CarouselInternalState) => void;

	let containerRef: HTMLDivElement;
	let listRef: HTMLDivElement;

	let children = [];
	export let props: CarouselProps = {
		slidesToSlide,
		infinite,
		draggable,
		swipeable,
		arrows,
		renderArrowsWhenDisabled,
		removeArrowOnDeviceType,
		containerClass: '',
		sliderClass: '',
		itemClass: '',
		dotListClass: '',
		keyBoardControl: true,
		centerMode: false,
		autoPlay: false,
		autoPlaySpeed: 3000,
		showDots: false,
		renderDotsOutside: false,
		renderButtonGroupOutside: false,
		minimumTouchDrag,
		className,
		focusOnSelect: false,
		additionalTransfrom: 0,
		pauseOnHover: true,
		children: [],
		responsive,
		ssr,
		itemAriaLabel: undefined,
	};

	// $: props = {
	// 	slidesToSlide,
	// 	infinite,
	// 	draggable,
	// 	swipeable,
	// 	arrows,
	// 	renderArrowsWhenDisabled,
	// 	removeArrowOnDeviceType,
	// 	containerClass,
	// 	sliderClass,
	// 	itemClass,
	// 	keyBoardControl,
	// 	autoPlaySpeed,
	// 	showDots,
	// 	renderDotsOutside,
	// 	renderButtonGroupOutside,
	// 	minimumTouchDrag,
	// 	className,
	// 	dotListClass,
	// 	focusOnSelect,
	// 	centerMode,
	// 	additionalTransfrom,
	// 	pauseOnHover,
	// 	children,
	// 	responsive,
	// ssr,
	// 	itemAriaLabel,
	// };

	const defaultTransitionDuration = 400;
	const defaultTransition = 'transform 400ms ease-in-out';

	let direction: Direction = '';
	let onMove: boolean = false;
	let initialX: number = 0;
	let initialY: number = 0;
	let lastX: number = 0;
	let isAnimationAllowed: boolean = false;
	let isInThrottle: boolean = false;

	let itemWidth = 0;
	let slidesToShow = 0;

	let transformPlaceHolder: number = 0;
	let itemsToShowTimeout: any;
	// let autoPlay: any;

	const state: CarouselInternalState = {
		itemWidth: 0,
		slidesToShow: 0,
		currentSlide: 0,
		totalItems: containerRef.children.length,
		deviceType: '',
		domLoaded: false,
		transform: 0,
		containerWidth: 0,
	};

	// $: {
	// 	if (typeof afterChange === 'function') {
	// 		setTimeout(() => {
	// 			afterChange(previousSlide, this.getState());
	// 		}, transitionDuration || defaultTransitionDuration);
	// 	}
	// }

	$: {
		if (!keyBoardControl) {
			window.removeEventListener('keyup', onKeyUp);
		} else {
			window.addEventListener('keyup', onKeyUp);
		}
	}

	onMount(() => {
		state.domLoaded = true;
		state.totalItems = containerRef.children.length;
		setItemsToShow();
		window.addEventListener('resize', onResize as any);
		onResize(true);

		if (keyBoardControl) {
			window.addEventListener('keyup', onKeyUp);
		}

		if (autoPlay && autoPlaySpeed) {
			autoPlay = setInterval(next, autoPlaySpeed);
		}
	});

	afterUpdate(() => {
		if (itemsToShowTimeout) {
			clearTimeout(itemsToShowTimeout);
		}
	});

	onDestroy(() => {
		window.removeEventListener('resize', onResize as any);

		if (keyBoardControl) {
			window.removeEventListener('keyup', onKeyUp);
		}

		if (autoPlay) {
			//props.autoPlay &&
			clearInterval(autoPlay);
			autoPlay = undefined;
		}

		if (itemsToShowTimeout) {
			clearTimeout(itemsToShowTimeout);
		}
	});

	function resetTotalItems(): void {
		const totalItems = containerRef.children.length;
		const currentSlide = notEnoughChildren(slidesToShow, totalItems)
			? 0
			: // this ensures that if the currentSlide before change in childrenCount is more than new childrenCount; we will set it to new childrenCount
			  Math.max(0, Math.min(state.currentSlide, totalItems));

		state.totalItems = totalItems;
		state.currentSlide = currentSlide;
		setContainerAndItemWidth(state.slidesToShow, true);
	}

	function setIsInThrottle(isInThrottle = false): void {
		isInThrottle = isInThrottle;
	}

	function setTransformDirectly(position: number, withAnimation?: boolean) {
		const currentTransform = getTransform(state, props, position);
		transformPlaceHolder = position;

		if (listRef) {
			setAnimationDirectly(withAnimation);
			listRef.style.transform = `translate3d(${
				currentTransform + additionalTransfrom!
			}px,0,0)`;
		}
	}

	function setAnimationDirectly(animationAllowed?: boolean) {
		if (listRef) {
			if (animationAllowed) {
				listRef.style.transition = customTransition || defaultTransition;
			} else {
				listRef.style.transition = 'none';
			}
		}
	}

	function setClones(
		slidesToShow: number,
		itemWidth?: number,
		forResizing?: boolean,
		resetCurrentSlide = false
	): void {
		// if forResizing is true, means we are on client-side.
		// if forResizing is false, means we are on server-side.
		// because the first time we set the clones, we change the position of all carousel items when entering client-side from server-side.
		// but still, we want to maintain the same position as it was on the server-side which is translateX(0) by getting the couter part of the original first slide.
		isAnimationAllowed = false;
		const childrenArr = Array.from(children);
		const initialSlide = getInitialSlideInInfiniteMode(
			slidesToShow || state.slidesToShow,
			childrenArr
		);

		const clones = getClones(state.slidesToShow, childrenArr);
		const currentSlide = childrenArr.length < state.slidesToShow ? 0 : state.currentSlide;

		state.totalItems = clones.length;
		state.currentSlide = forResizing && !resetCurrentSlide ? currentSlide : initialSlide;

		correctItemsPosition(itemWidth || state.itemWidth);
	}

	function setItemsToShow(
		shouldCorrectItemPosition?: boolean,
		resetCurrentSlide?: boolean
	): void {
		Object.keys(responsive).forEach((item) => {
			const { breakpoint, items } = responsive[item];
			const { max, min } = breakpoint;
			if (window.innerWidth >= min && window.innerWidth <= max) {
				state.slidesToShow = items;
				state.deviceType = item;
				setContainerAndItemWidth(items, shouldCorrectItemPosition, resetCurrentSlide);
			}
		});
	}

	function setContainerAndItemWidth(
		slidesToShow: number,
		shouldCorrectItemPosition?: boolean,
		resetCurrentSlide?: boolean
	): void {
		if (containerRef) {
			const newContainerWidth = containerRef.offsetWidth;
			const newItemWidth: number = getItemClientSideWidth(
				props,
				slidesToShow,
				newContainerWidth
			);

			state.containerWidth = newContainerWidth;
			state.itemWidth = newItemWidth;

			if (infinite) {
				setClones(slidesToShow, itemWidth, shouldCorrectItemPosition, resetCurrentSlide);
			}

			if (shouldCorrectItemPosition) {
				correctItemsPosition(itemWidth);
			}
		}
	}

	function correctItemsPosition(
		itemWidth: number,
		checkIsAnimationAllowed?: boolean,
		setToDomDirectly?: boolean
	): void {
		/*
    For swipe, drag and resizing, they changed the position of the carousel, but the position are not always correct.
    Hence, this is to make sure our items are in the correct place.
    */
		if (checkIsAnimationAllowed) {
			isAnimationAllowed = true;
		}

		if (!checkIsAnimationAllowed && isAnimationAllowed) {
			isAnimationAllowed = false;
		}

		const nextTransform =
			state.totalItems < state.slidesToShow ? 0 : -(itemWidth * state.currentSlide);

		if (setToDomDirectly) {
			setTransformDirectly(nextTransform, true);
		}

		state.transform = nextTransform;
	}

	function onResize(value?: KeyboardEvent | boolean): void {
		// value here can be html event or a boolean.
		// if its in infinite mode, we want to keep the current slide index no matter what.
		// if its not infinite mode, keeping the current slide index has already been taken care of
		let shouldCorrectItemPosition: boolean;

		if (!infinite) {
			shouldCorrectItemPosition = false;
		} else {
			if (typeof value === 'boolean' && value) {
				shouldCorrectItemPosition = false;
			} else {
				shouldCorrectItemPosition = true;
			}
		}

		setItemsToShow(shouldCorrectItemPosition);
	}

	function correctClonesPosition({
		domLoaded, // this domLoaded comes from previous state, only use to tell if we are on client-side or server-side because this functin relies the dom.
	}: {
		domLoaded?: boolean;
	}): void {
		const childrenArr = Array.from(children);
		const {
			isReachingTheEnd,
			isReachingTheStart,
			nextSlide,
			nextPosition,
		} = checkClonesPosition(state, childrenArr, props);

		if (
			// this is to prevent this gets called on the server-side.
			state.domLoaded &&
			domLoaded
		) {
			if (isReachingTheEnd || isReachingTheStart) {
				isAnimationAllowed = false;
				setTimeout(() => {
					state.transform = nextPosition;
					state.currentSlide = nextSlide;
				}, transitionDuration || defaultTransitionDuration);
			}
		}
	}

	const next = throttle(
		function next(slidesHavePassed = 0): void {
			if (notEnoughChildren(state.slidesToShow, state.totalItems)) {
				return;
			}
			/*
    two cases:
    1. We are not over-sliding.
    2. We are sliding over to what we have, that means nextslides > this.props.children.length. (does not apply to the inifnite mode)
    */
			const { nextSlides, nextPosition } = populateNextSlides(state, props, slidesHavePassed);

			const previousSlide = state.currentSlide;
			if (nextSlides === undefined || nextPosition === undefined) {
				// they can be 0.
				return;
			}

			if (typeof beforeChange === 'function') {
				beforeChange(nextSlides, getState());
			}

			isAnimationAllowed = true;
			state.transform = nextPosition;
			state.currentSlide = nextSlides;

			if (typeof afterChange === 'function') {
				setTimeout(() => {
					afterChange(previousSlide, getState());
				}, transitionDuration || defaultTransitionDuration);
			}
		},
		transitionDuration || defaultTransitionDuration,
		setIsInThrottle
	);

	const previous = throttle(
		function previous(slidesHavePassed = 0): void {
			if (notEnoughChildren(state.slidesToShow, state.totalItems)) {
				return;
			}

			const { nextSlides, nextPosition } = populatePreviousSlides(
				state,
				props,
				slidesHavePassed
			);
			if (nextSlides === undefined || nextPosition === undefined) {
				// they can be 0, which goes back to the first slide.
				return;
			}

			const previousSlide = state.currentSlide;
			if (typeof beforeChange === 'function') {
				beforeChange(nextSlides, getState());
			}

			isAnimationAllowed = true;

			state.transform = nextPosition;
			state.currentSlide = nextSlides;

			if (typeof afterChange === 'function') {
				setTimeout(() => {
					afterChange(previousSlide, getState());
				}, transitionDuration || defaultTransitionDuration);
			}
		},
		transitionDuration || defaultTransitionDuration,
		setIsInThrottle
	);

	function resetMoveStatus(): void {
		onMove = false;
		initialX = 0;
		lastX = 0;
		direction = '';
		initialY = 0;
	}

	function handleDown(e: MouseEvent | TouchEvent): void {
		if (
			(!isMouseMoveEvent(e) && !swipeable) ||
			(isMouseMoveEvent(e) && !draggable) ||
			isInThrottle
		) {
			return;
		}

		const { clientX, clientY } = isMouseMoveEvent(e) ? e : e.touches[0];

		onMove = true;
		initialX = clientX;
		initialY = clientY;
		lastX = clientX;
		isAnimationAllowed = false;
	}

	function handleMove(e: MouseEvent | TouchEvent): void {
		if (
			(!isMouseMoveEvent(e) && !swipeable) ||
			(isMouseMoveEvent(e) && !draggable) ||
			notEnoughChildren(state.slidesToShow, state.totalItems)
		) {
			return;
		}

		const { clientX, clientY } = isMouseMoveEvent(e) ? e : e.touches[0];
		const diffX = initialX - clientX;
		const diffY = initialY - clientY;
		if (!isMouseMoveEvent(e) && autoPlay && autoPlay && pauseOnHover) {
			clearInterval(autoPlay);
			autoPlay = undefined;
		}
		if (onMove) {
			if (!(Math.abs(diffX) > Math.abs(diffY))) {
				// prevent swiping up and down moves the carousel.
				return;
			}
			const {
				direction: currentDirection,
				nextPosition,
				canContinue,
			} = populateSlidesOnMouseTouchMove(
				state,
				props,
				initialX,
				lastX,
				clientX,
				transformPlaceHolder
			);
			if (currentDirection) {
				direction = currentDirection;
				if (canContinue && nextPosition !== undefined) {
					// nextPosition can be 0;
					setTransformDirectly(nextPosition);
				}
			}
			lastX = clientX;
		}
	}

	function handleOut(e: MouseEvent | TouchEvent): void {
		if (!autoPlay) {
			//props.autoPlay &&
			autoPlay = setInterval(next, autoPlaySpeed);
		}
		const shouldDisableOnMobile = e.type === 'touchend' && !swipeable;
		const shouldDisableOnDesktop =
			(e.type === 'mouseleave' || e.type === 'mouseup') && !draggable;
		if (shouldDisableOnMobile || shouldDisableOnDesktop) {
			return;
		}
		if (onMove) {
			setAnimationDirectly(true);

			if (direction === 'right') {
				const canGoNext = initialX - lastX >= minimumTouchDrag!;
				if (canGoNext) {
					const slidesHavePassed = Math.round((initialX - lastX) / state.itemWidth);
					next(slidesHavePassed);
				} else {
					correctItemsPosition(state.itemWidth, true, true);
				}
			}

			if (direction === 'left') {
				const canGoNext = lastX - initialX > minimumTouchDrag!;
				if (canGoNext) {
					const slidesHavePassed = Math.round((lastX - initialX) / state.itemWidth);
					previous(slidesHavePassed);
				} else {
					correctItemsPosition(state.itemWidth, true, true);
				}
			}

			resetMoveStatus();
		}
	}

	function onKeyUp(e: KeyboardEvent): void {
		switch (e.keyCode) {
			case 37:
				return previous();
			case 39:
				return next();
		}
	}

	function handleEnter(): void {
		if (autoPlay) {
			//&& props.autoPlay
			clearInterval(autoPlay);
			autoPlay = undefined;
		}
	}

	const goToSlide = throttle(
		function goToSlide(slide: number, skipCallbacks?: SkipCallbackOptions): void {
			if (isInThrottle) {
				return;
			}

			const { itemWidth } = state;
			const previousSlide = state.currentSlide;
			if (
				typeof beforeChange === 'function' &&
				(!skipCallbacks ||
					(typeof skipCallbacks === 'object' && !skipCallbacks.skipBeforeChange))
			) {
				beforeChange(slide, getState());
			}

			isAnimationAllowed = true;
			state.currentSlide = slide;
			state.transform = -(itemWidth * slide);

			if (infinite) {
				correctClonesPosition({ domLoaded: true });
			}

			if (
				typeof afterChange === 'function' &&
				(!skipCallbacks ||
					(typeof skipCallbacks === 'object' && !skipCallbacks.skipAfterChange))
			) {
				setTimeout(() => {
					afterChange(previousSlide, getState());
				}, transitionDuration || defaultTransitionDuration);
			}
		},
		transitionDuration || defaultTransitionDuration,
		setIsInThrottle
	);

	function getState(): StateCallBack {
		return state;
	}

	const { shouldRenderOnSSR, shouldRenderAtAll } = getInitialState(state, props);

	const isLeftEndReach = isInLeftEnd(state);
	const isRightEndReach = isInRightEnd(state);

	const shouldShowArrows =
		arrows &&
		!(
			removeArrowOnDeviceType &&
			((deviceType && removeArrowOnDeviceType.indexOf(deviceType) > -1) ||
				(state.deviceType && removeArrowOnDeviceType.indexOf(state.deviceType) > -1))
		) &&
		!notEnoughChildren(state.slidesToShow, state.totalItems) &&
		shouldRenderAtAll;

	const disableLeftArrow = !infinite && isLeftEndReach;
	const disableRightArrow = !infinite && isRightEndReach;

	// this lib supports showing next set of items partially as well as center mode which shows both.
	const currentTransform = getTransform(state, props);

	function buttonGroupGoToSlide(slideIndex: number, skipCallbacks?: SkipCallbackOptions) {
		return goToSlide(slideIndex, skipCallbacks);
	}
</script>

<div bind:this={containerRef} class={`multi-carousel-list ${containerClass} ${className}`}>
	<div
		bind:this={listRef}
		class={`react-multi-carousel-track ${sliderClass}`}
		style={`
        transition: ${isAnimationAllowed ? customTransition || defaultTransition : 'none'},
        overflow: ${shouldRenderOnSSR ? 'hidden' : 'unset'},
        transform: translate3d(${currentTransform + additionalTransfrom}px,0,0)`}
		on:mousemove={handleMove}
		on:mousedown={handleDown}
		on:mouseup={handleOut}
		on:mouseenter={handleEnter}
		on:mouseleave={handleOut}
		on:touchstart={handleDown}
		on:touchmove={handleMove}
		on:touchend={handleOut}
	>
		<div class="content">
			<slot {clones} {state} {props} {goToSlide} />
		</div>
	</div>
	{#if shouldShowArrows && (!disableLeftArrow || renderArrowsWhenDisabled)}
		<slot name="customLeftArrow" {previous} disabled={disableLeftArrow}>
			<LeftArrow getState={() => getState()} {previous} disabled={disableLeftArrow} />
		</slot>
	{/if}
	{#if shouldShowArrows && (!disableRightArrow || renderArrowsWhenDisabled)}
		<slot name="customRightArrow" {next} disabled={disableRightArrow}>
			<RightArrow getState={() => getState()} {next} disabled={disableRightArrow} />
		</slot>
	{/if}
	{#if shouldRenderAtAll && !renderButtonGroupOutside}
		<slot
			name="cutomButtonGroup"
			gotToSlide={buttonGroupGoToSlide}
			carouselState={getState()}
			{previous}
			{next}
		/>
	{/if}
	{#if shouldRenderAtAll && !renderDotsOutside}
		<slot name="customDots">
			<Dots {state} {props} {goToSlide} getState={() => getState()} />
		</slot>
	{/if}
</div>
{#if shouldRenderAtAll && renderDotsOutside}
	<slot name="customDots">
		<Dots {state} {props} {goToSlide} getState={() => getState()} />
	</slot>
{/if}

{#if shouldRenderAtAll && renderButtonGroupOutside}
	<slot
		name="cutomButtonGroup"
		gotToSlide={buttonGroupGoToSlide}
		carouselState={getState()}
		{previous}
		{next}
	/>
{/if}

<style>
	div {
		position: relative;
	}

	.slider {
		touch-action: pan-y;
		-webkit-overflow-scrolling: touch;
		-ms-overflow-style: -ms-autohiding-scrollbar;
	}

	.mask {
		overflow-x: visible;
		padding-bottom: 1px;
	}

	.content {
		white-space: nowrap;
	}

	.swipe-handler {
		width: 100%;
		position: absolute;
		top: var(--slider-handler, 0px);
		bottom: 0px;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0);
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
</style>
