<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { debouncePromise, getFocusableChildren } from '$lib/utils';

	const FOCUS_ATTRIBUTE = 'data-focus-visible';

	function getPrevElement(list: Element[]): HTMLElement {
		return list[0].previousElementSibling as HTMLElement;
	}

	function getNextElement(list: Element[]): HTMLElement | null {
		const sibling = list[list.length - 1].nextElementSibling;

		if (sibling instanceof HTMLElement) return sibling;

		return null;
	}
</script>

<script lang="ts">
	import SiemaItem from './CarouselItem.svelte';
	import LeftButton from './LeftButton.svelte';
	import RightButton from './RightButton.svelte';

	type T = $$Generic;

	interface $$Slots {
		default: {
			item: any;
			visible: boolean;
		};
		right: {
			value: 'prev' | 'next';
			scroll: typeof scroll;
			setKeyboardFocus: typeof setKeyboardFocus;
		};
		left: {
			value: 'prev' | 'next';
			scroll: typeof scroll;
			setKeyboardFocus: typeof setKeyboardFocus;
		};
	}

	export let items: T[];
	export let rtl: boolean = false;

	let container: HTMLDivElement;
	let containerInner: HTMLUListElement;
	let prevElement: HTMLElement | null = null;
	let nextElement: HTMLElement | null = null;
	let scrollDir: 'prev' | 'next';

	const itemsVisibility: boolean[] = Array(items.length).fill(true);

	onMount(() => {
		rtl = document.documentElement.dir === 'rtl' ? true : false;
	});

	function position(node: HTMLElement) {
		function updateCalc() {
			const rect = node.getBoundingClientRect();

			// const children = Array.from(node.children[0]?.children);
			const children = Array.from(node.children);
			const visibleElements = (children as HTMLElement[]).filter((child, i) => {
				const childRect = child.getBoundingClientRect();

				itemsVisibility[i] =
					Math.ceil(childRect.left) >= rect.left &&
					Math.floor(childRect.right) <= rect.right;

				return itemsVisibility[i];
			});

			if (visibleElements.length === 0) return visibleElements;

			prevElement = getPrevElement(visibleElements);
			nextElement = getNextElement(visibleElements);

			return visibleElements;
		}

		const debounced = debouncePromise(() => {}, 100);

		async function handler(_: Event) {
			const visibleElements = updateCalc();

			await debounced();

			const focusVisibleBtn = container.querySelector(
				`[${FOCUS_ATTRIBUTE}]`,
			) as HTMLButtonElement;

			if (!focusVisibleBtn) return;

			requestAnimationFrame(() => {
				const elementToFocus =
					scrollDir === 'next'
						? visibleElements[0]
						: visibleElements[visibleElements.length - 1];

				const focusableElements = getFocusableChildren(elementToFocus);

				focusableElements[0]?.focus();

				container.blur();
				focusVisibleBtn.removeAttribute(FOCUS_ATTRIBUTE);
			});
		}

		updateCalc();

		const resizeObserver = new ResizeObserver(() => updateCalc());
		resizeObserver.observe(node);

		const options = { passive: true };
		node.addEventListener('scroll', handler, options);

		return {
			destroy() {
				// @ts-ignore - see:
				// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
				// https://github.com/microsoft/TypeScript/issues/32912
				node.removeEventListener('scroll', handler, options);
				resizeObserver.disconnect();
			},
		};
	}

	function setKeyboardFocus(e: FocusEvent) {
		const btn = e.currentTarget as HTMLButtonElement;
		/**
		 * thank to this article
		 * https://www.bennadel.com/blog/3476-checking-to-see-if-an-element-has-a-css-pseudo-class-in-javascript.htm
		 */
		btn.matches(':focus-visible') && btn.setAttribute(FOCUS_ATTRIBUTE, '');
	}

	function scrollToElement(el: HTMLElement | null, offset = 0, dir: 'next' | 'prev' = 'next') {
		if (!containerInner || !el) return;

		const css = getComputedStyle(container);

		containerInner.scroll({
			left: el.offsetLeft + offset - parseInt(css.paddingInlineStart || css.paddingLeft),
			behavior: 'smooth',
		});

		// el.scrollIntoView({
		// 	behavior: 'smooth',
		// 	inline: dir === 'next' ? 'start' : 'end',
		// 	block: 'nearest',
		// });
	}

	function scroll(e: Event) {
		const btn = e.currentTarget as HTMLButtonElement;
		const direction = (btn.value || btn.dataset.value) as 'prev' | 'next';
		scrollDir = direction;

		const containerWidth = containerInner.getBoundingClientRect().width;
		switch (direction) {
			case 'prev': {
				const offset = rtl
					? 0
					: -(containerWidth - (prevElement?.getBoundingClientRect().width || 0));
				scrollToElement(prevElement, offset, 'prev');
				break;
			}
			case 'next': {
				const offset = rtl
					? -(containerWidth - (nextElement?.getBoundingClientRect().width || 0))
					: 0;
				scrollToElement(nextElement, offset);
				break;
			}
		}
	}

	$: hasItemsOnLeft = rtl ? nextElement !== null : prevElement !== null;
	$: hasItemsOnRight = rtl ? prevElement !== null : nextElement !== null;

	$: style = `
	--has-items-left: ${hasItemsOnLeft ? 'all' : 'hidden'};
	--has-items-right: ${hasItemsOnRight ? 'all' : 'hidden'};
	`.trim();
</script>

<div class="container" bind:this={container} {style}>
	<slot name="left" scroll setKeyboardFocus removeKeyboradFocus value={rtl ? 'next' : 'prev'}>
		<LeftButton {scroll} {setKeyboardFocus} value={rtl ? 'next' : 'prev'} />
	</slot>

	<ul class="inner" bind:this={containerInner} use:position>
		{#each items as item, i}
			<SiemaItem>
				<slot {item} visible={itemsVisibility[i]} />
			</SiemaItem>
		{/each}
		<!-- <div class="content">
		</div> -->
	</ul>

	<slot name="right" scroll setKeyboardFocus removeKeyboradFocus value={rtl ? 'prev' : 'next'}>
		<RightButton {scroll} {setKeyboardFocus} value={rtl ? 'prev' : 'next'} />
	</slot>
</div>

<style lang="scss">
	.container {
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		// inline margins and paddings wouldn't work correctly
		// if writing mode is set to something else
		writing-mode: horizontal-tb;
		touch-action: pan-y;
		margin: var(--carousel-container-padding, 0 1em);
	}

	.inner {
		list-style: none;
		display: inline-flex;
		overflow-x: auto;
		justify-content: flex-start;

		scroll-behavior: smooth;
		scroll-snap-type: var(--carousel-scroll-snap, x mandatory);
		padding: var(--carousel-inner-padding);
		// max-width: var(--carousel-content-max-width);

		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.content {
		display: inline-flex;
		// flex-wrap: nowrap;
		// white-space: nowrap;
		// margin-left: auto;
		// margin-right: auto;
		// width: 100%;
		max-width: var(--carousel-content-max-width);

		padding: var(--carousel-content-padding);
		// margin-inline-start: -1rem;
	}
</style>
