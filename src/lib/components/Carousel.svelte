<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let itemsPerView: number = 3;
	export let draggable = true;
	export let threshold = 20;
	export let showIndicators: boolean = false;
	export let defaultIndex: number = 0;
	export let oriantation: 'vertical' | 'horizontal' = 'horizontal';

	export let autoplay = false;
	export let delay = 1000;
	export let transitionDuration = 200;
	export let activeItem = 0;

	let touch_active = false;
	let page_axis = oriantation === 'vertical' ? 'pageY' : 'pageX',
		activeIndicator = 0,
		indicators: any[],
		totalElements = 0,
		availableSpace = 0,
		availableWidth = 0,
		availableDistance = 0,
		pos_axis = 0,
		axis: number,
		longTouch: boolean,
		last_axis_pos: number,
		sliderWrapper: HTMLDivElement,
		sliderElements: NodeListOf<any>,
		sliderHandler: HTMLDivElement;

	let played = defaultIndex || 0;
	let run_interval: boolean = false;

	let IntervalID: ReturnType<typeof setTimeout>;

	$: indicators = Array(totalElements);

	$: {
		if (autoplay && !run_interval) {
			IntervalID = setInterval(changeView, delay);
			run_interval = true;
		}
		if (!autoplay && run_interval) {
			clearInterval(IntervalID);
			run_interval = false;
		}
	}

	onMount(() => {
		init();
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', update);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', update);
		}
	});

	function init() {
		sliderElements = sliderWrapper.querySelectorAll('.slider-item');
		totalElements = sliderElements.length;
		update();
	}

	function update() {
		let { offsetWidth, offsetHeight } = sliderWrapper;
		availableSpace = oriantation === 'vertical' ? offsetHeight : offsetWidth;

		[...sliderElements].forEach((element, i) => {
			element.style.transform = generateTranslateValue(availableSpace * i);
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
			window[delegationTypes[type]]('touchmove', onMove, {
				passive: false,
			});
			/*@ts-ignore*/
			window[delegationTypes[type]]('touchend', onEnd, {
				passive: false,
			});
		}
	}
	function normalizeEventBehavior(e?: Event) {
		e?.preventDefault();
		e?.stopImmediatePropagation();
		e?.stopPropagation();
	}

	function generateTranslateValue(value: number) {
		return oriantation === 'vertical' ? `translate3d(0, ${value}px, 0)` : `translate3d(${value}px, 0, 0)`;
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

	function onMove(e: MouseEvent | TouchEvent) {
		if (touch_active) {
			normalizeEventBehavior(e);
			let _axis: number = (e as TouchEvent).touches
					? //@ts-ignore
					  (e as TouchEvent).touches[0][page_axis]
					: //@ts-ignore
					  (e as MouseEvent)[page_axis],
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
		axis = e.touches
			? //@ts-ignore
			  e.touches[0][page_axis]
			: //@ts-ignore
			  (e as MouseEvent)[page_axis];
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

		axis = 0;
		last_axis_pos = 0;
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
			<slot />
		</div>
	</div>
	<div class="swipe-handler" bind:this={sliderHandler} on:touchstart={onTouchStart} on:mousedown={onMoveStart} />
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
