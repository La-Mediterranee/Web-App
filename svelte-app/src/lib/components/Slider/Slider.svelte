<script lang="ts">
	import { onMount, tick, createEventDispatcher } from 'svelte';
	import Arrow from './Arrows';
	import Indicators from './Indicators';
	import { createStore } from './store';

	interface CarouelOptions {
		itemsPerView?: number;
	}

	interface IbreakPoints {
		[width: number]: CarouelOptions;
	}

	export let sliderElements: [];
	export let itemsPerView: number = 1;
	export let draggable = true;
	export let threshold = 20;
	export let breakpoints: IbreakPoints;
	/**
	 * Enable Next/Prev arrows
	 */
	export let arrows = true;
	/**
	 * Current slide indicator
	 */
	export let showIndicators: boolean = false;
	/**
	 * Transition duration in ms
	 */
	export let transitionDuration = 200;
	/**
	 * Infinite looping
	 */
	export let infinite = true;
	export let activeItem = 0;

	const dispatch = createEventDispatcher();
	let store = createStore();

	let touch_active = false;
	let activeIndicator = 0;
	let totalElements = 0;
	let availableSpace = 0;
	let availableWidth = 0;
	let availableDistance = 0;
	let pos_axis = 0;

	let indicators: any[];
	let axis: number;
	let longTouch: boolean;
	let last_axis_pos: number;
	let sliderWrapper: HTMLDivElement;
	let sliderHandler: HTMLDivElement;

	let played = defaultIndex || 0;

	$: indicators = Array(totalElements);

	$: offset = 0;

	onMount(() => {
		init();
		window.addEventListener('resize', update);

		return () => {
			window.removeEventListener('resize', update);
		};
	});

	function init() {
		totalElements = sliderElements.length;
		update();
	}

	function update() {
		const { offsetWidth, offsetHeight } = sliderWrapper;
		// availableSpace = oriantation === 'vertical' ? offsetHeight : offsetWidth;

		[...sliderElements].forEach((element, i) => {
			element.style.transform = generateTranslateValue(offsetWidth * i);
		});

		availableDistance = 0;
		availableWidth = availableSpace * (totalElements - 1);

		if (defaultIndex) {
			changeItem(defaultIndex);
		}
	}

	// helpers
	function eventDelegate(type: string) {
		const delegationTypes = {
			add: 'addEventListener',
			remove: 'removeEventListener',
		};

		if (typeof window !== 'undefined') {
			/*@ts-ignore*/
			window[delegationTypes[type]]('mousemove', onMove);
			/*@ts-ignore*/
			window[delegationTypes[type]]('mouseup', onEnd);
			/*@ts-ignore*/
			window[delegationTypes[type]]('touchmove', onMove, { passive: false });
			/*@ts-ignore*/
			window[delegationTypes[type]]('touchend', onEnd, { passive: false });
		}
	}

	function normalizeEventBehavior(e: Event) {
		e && e.preventDefault();
		e && e.stopImmediatePropagation();
		e && e.stopPropagation();
	}

	function onKeyUp(e: KeyboardEvent): void {
		const key = e.keyCode;

		switch (key) {
			case 37:
				return this.previous();
			case 39:
				return this.next();
		}
	}

	function handleMove(e: MouseEvent | TouchEvent) {
		if (
			(!isMouseMoveEvent(e) && !this.props.swipeable) ||
			(isMouseMoveEvent(e) && !this.props.draggable) ||
			notEnoughChildren(this.state)
		) {
			return;
		}
	}

	function generateTranslateValue(value: number) {
		return `translate3d(${value}px, 0, 0)`;
		// return oriantation === 'vertical'
		// 	? `translate3d(0, ${value}px, 0)`
		// 	: `translate3d(${value}px, 0, 0)`;
	}

	function generateTouchPosCss(value: number, touch_end = false) {
		let transformString = generateTranslateValue(value);
		let _css = `
      -webkit-transition-duration: ${touch_end ? transitionDuration : '0'}ms;
      transition-duration: ${touch_end ? transitionDuration : '0'}ms;
      -webkit-transform: ${transformString};
      -ms-transform: ${transformString};`;
		return _css;
	}

	function onMove(e: TouchEvent) {
		if (touch_active) {
			normalizeEventBehavior(e);
			let _axis = e.touches ? e.touches[0][page_axis] : e[page_axis],
				distance = axis - _axis + pos_axis;

			if (distance <= availableWidth && distance >= 0) {
				[...sliderElements].forEach((element, i) => {
					element.style.cssText = generateTouchPosCss(availableSpace * i - distance);
				});
				availableDistance = distance;
				last_axis_pos = _axis;
			}
		}
	}

	function onTouchStart(e: TouchEvent) {
		axis = e.touches ? e.touches[0][page_axis] : e[page_axis];
		onMoveStart(e);
	}

	function onMoveStart(e: TouchEvent | MouseEvent) {
		normalizeEventBehavior(e);
		touch_active = true;
		longTouch = false;
		setTimeout(function () {
			longTouch = true;
		}, 250);
		eventDelegate('add');
	}

	function onEnd(e?: Event) {
		normalizeEventBehavior(e);
		let direction = axis < last_axis_pos;
		touch_active = false;
		let _as = availableSpace;
		let accidental_touch = Math.round(availableSpace / 50) > Math.abs(axis - last_axis_pos);

		if (longTouch || accidental_touch) {
			availableDistance = Math.round(availableDistance / _as) * _as;
		} else {
			availableDistance = direction
				? Math.floor(availableDistance / _as) * _as
				: Math.ceil(availableDistance / _as) * _as;
		}

		axis = null;
		last_axis_pos = null;
		pos_axis = availableDistance;
		activeIndicator = availableDistance / _as;

		[...sliderElements].forEach((element, i) => {
			element.style.cssText = generateTouchPosCss(_as * i - pos_axis, true);
		});

		activeItem = activeIndicator;
		defaultIndex = activeItem;
		eventDelegate('remove');
	}

	function changeItem(item: number) {
		const max = availableSpace;
		availableDistance = max * item;
		activeIndicator = item;
		onEnd();
	}

	function changeView() {
		changeItem(played);
		played = played < totalElements - 1 ? ++played : 0;
	}

	export function goTo(step: number) {
		let item = Math.max(0, Math.min(step, indicators.length - 1));
		changeItem(item);
	}

	export function prevItem() {
		let step = activeIndicator - 1;
		goTo(step);
	}

	export function nextItem() {
		let step = activeIndicator + 1;
		goTo(step);
	}
</script>

<div class="slider">
	<div class="mask">
		<div class="content" bind:this={sliderWrapper}>
			{#each sliderElements as sliderElement, index}
				<!-- content here -->
				<slot {sliderElement} {index} />
			{/each}
		</div>
	</div>
	<div
		class="swipe-handler"
		bind:this={sliderHandler}
		on:touchstart={onTouchStart}
		on:mousedown={onMoveStart}
	/>
	{#if arrows}
		<slot name="next" {showNextPage}>
			<div class="sc-carousel__arrow-container">
				<Arrow
					direction="next"
					disabled={!infinite && originalCurrentPageIndex === originalPagesCount - 1}
					on:click={showNextPage}
				/>
			</div>
		</slot>
	{/if}
	{#if showIndicators}
		<div class="swipe-indicator swipe-indicator-inside">
			{#each indicators as x, i}
				<slot name="indicators" {activeIndicator} index={i}>
					<span
						class="dot"
						class:is-active={activeIndicator === i}
						on:click={() => {
							changeItem(i);
						}}
					/>
					<!-- on:click|preventDefault|stopPropagation={() => {
							changeItem(i);
						}} -->
				</slot>
			{/each}
		</div>
	{/if}
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
</style>
