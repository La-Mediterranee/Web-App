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

	export let responsive: ResponsiveType;
	export let slidesToSlide = 1;
	export let infinite = false;
	export let draggable = true;
	export let swipeable = true;
	export let arrows = true;
	export let renderArrowsWhenDisabled = false;
	export let containerClass = '';
	export let sliderClass = '';
	export let itemClass = '';
	export let keyBoardControl = true;
	export let autoPlaySpeed = 3000;
	export let showDots = false;
	export let renderDotsOutside = false;
	export let renderButtonGroupOutside = false;
	export let minimumTouchDrag = 80;
	export let className = '';
	export let dotListClass = '';
	export let focusOnSelect = false;
	export let centerMode = false;
	export let additionalTransfrom = 0;
	export let pauseOnHover = true;
	export let customTransition: string;
	export let afterChange: (arg0: number, arg1: CarouselInternalState) => void;
	export let beforeChange: (arg0: number, arg1: CarouselInternalState) => void;
	export let transitionDuration: number;

	let containerRef: HTMLDivElement;
	let listRef: HTMLDivElement;

	let children = containerRef.children;

	const defaultTransitionDuration = 400;
	const defaultTransition = 'transform 400ms ease-in-out';

	$: props = {
		slidesToSlide,
		infinite,
		draggable,
		swipeable,
		arrows,
		renderArrowsWhenDisabled,
		containerClass,
		sliderClass,
		itemClass,
		keyBoardControl,
		autoPlaySpeed,
		showDots,
		renderDotsOutside,
		renderButtonGroupOutside,
		minimumTouchDrag,
		className,
		dotListClass,
		focusOnSelect,
		centerMode,
		additionalTransfrom,
		pauseOnHover,
		children,
		responsive,
	};

	let onMove: boolean = false;
	let initialX: number = 0;
	let lastX: number = 0;
	let isAnimationAllowed: boolean = false;
	let direction: Direction = '';
	let initialY: number = 0;
	let isInThrottle: boolean = false;
	let transformPlaceHolder: number = 0;

	let itemWidth = 0;
	let slidesToShow = 0;
	let currentSlide = 0;
	let totalItems = 0;
	let deviceType = '';
	let domLoaded = false;
	let transform = 0;
	let containerWidth = 0;

	let itemsToShowTimeout: any;
	let autoPlay: any;

	$: state = {
		itemWidth,
		slidesToShow,
		currentSlide,
		totalItems,
		deviceType,
		domLoaded,
		transform,
		containerWidth,
	};

	$: {
		if (!keyBoardControl) {
			window.removeEventListener('keyup', onKeyUp);
		} else {
			window.addEventListener('keyup', onKeyUp);
		}
	}

	onMount(() => {
		domLoaded = true;
		totalItems = containerRef.children.length;
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
		const newTotalItems = containerRef.children.length;
		const newCurrentSlide = notEnoughChildren(slidesToShow, totalItems)
			? 0
			: // this ensures that if the currentSlide before change in childrenCount is more than new childrenCount; we will set it to new childrenCount
			  Math.max(0, Math.min(currentSlide, newTotalItems));

		totalItems = newTotalItems;
		currentSlide = newCurrentSlide;
		setContainerAndItemWidth(slidesToShow, true);
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
		const newCurrentSlide = childrenArr.length < state.slidesToShow ? 0 : state.currentSlide;

		totalItems = clones.length;
		currentSlide = forResizing && !resetCurrentSlide ? newCurrentSlide : initialSlide;

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
				slidesToShow = items;
				deviceType = item;
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

			containerWidth = newContainerWidth;
			itemWidth = newItemWidth;
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

		const nextTransform = totalItems < slidesToShow ? 0 : -(itemWidth * currentSlide);

		if (setToDomDirectly) {
			setTransformDirectly(nextTransform, true);
		}

		transform = nextTransform;
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
					(transform = nextPosition), (currentSlide = nextSlide);
				}, transitionDuration || defaultTransitionDuration);
			}
		}
	}

	const next = throttle(
		function next(slidesHavePassed = 0): void {
			if (notEnoughChildren(slidesToShow, totalItems)) {
				return;
			}
			/*
    two cases:
    1. We are not over-sliding.
    2. We are sliding over to what we have, that means nextslides > this.props.children.length. (does not apply to the inifnite mode)
    */
			const { nextSlides, nextPosition } = populateNextSlides(state, props, slidesHavePassed);
			const previousSlide = currentSlide;

			if (nextSlides === undefined || nextPosition === undefined) {
				// they can be 0.
				return;
			}

			if (typeof beforeChange === 'function') {
				beforeChange(nextSlides, getState());
			}

			isAnimationAllowed = true;
			transform = nextPosition;
			currentSlide = nextSlides;

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
			if (notEnoughChildren(slidesToShow, totalItems)) {
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

			const previousSlide = currentSlide;
			if (typeof beforeChange === 'function') {
				beforeChange(nextSlides, getState());
			}

			isAnimationAllowed = true;

			transform = nextPosition;
			currentSlide = nextSlides;

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
			notEnoughChildren(slidesToShow, totalItems)
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
					const slidesHavePassed = Math.round((initialX - lastX) / itemWidth);
					next(slidesHavePassed);
				} else {
					correctItemsPosition(itemWidth, true, true);
				}
			}

			if (direction === 'left') {
				const canGoNext = lastX - initialX > minimumTouchDrag!;
				if (canGoNext) {
					const slidesHavePassed = Math.round((lastX - initialX) / itemWidth);
					previous(slidesHavePassed);
				} else {
					correctItemsPosition(itemWidth, true, true);
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

			const previousSlide = state.currentSlide;
			if (
				typeof beforeChange === 'function' &&
				(!skipCallbacks ||
					(typeof skipCallbacks === 'object' && !skipCallbacks.skipBeforeChange))
			) {
				beforeChange(slide, getState());
			}

			isAnimationAllowed = true;
			currentSlide = slide;
			transform = -(itemWidth * slide);

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

	const currentTransform = getTransform(state, props);
</script>

<div class={`multi-carousel-list ${containerClass} ${className}`} bind:this={containerRef}>
	<div
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
		<div class="content" bind:this={listRef}>
			<slot />
		</div>
	</div>
	<!-- <div
		class="swipe-handler"
		bind:this={sliderHandler}
		on:touchstart={onTouchStart}
		on:mousedown={onMoveStart}
	/>
	{#if showIndicators}
		<div class="swipe-indicator swipe-indicator-inside">
			{#each indicators as x, i}
				<slot name="indicators" {activeIndicator} index={i}>
					<span
						class="dot {activeIndicator === i ? 'is-active' : ''}"
						on:click={() => {
							changeItem(i);
						}}
					/>
				</slot>
			{/each}
		</div>
	{/if} -->
</div>

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
