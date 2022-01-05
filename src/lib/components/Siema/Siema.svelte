<script context="module" lang="ts">
	import { onMount } from 'svelte';

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
	import RightButton from './RightButton.svelte';
	import LeftButton from './LeftButton.svelte';

	import { debouncePromise, getFocusableChildren } from '$lib/utils';

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
	let containerInner: HTMLDivElement;
	let prevElement: HTMLElement | null = null;
	let nextElement: HTMLElement | null = null;

	const itemsVisibility: boolean[] = Array(items.length).fill(true);

	onMount(() => {
		rtl = document.documentElement.dir === 'rtl' ? true : false;
	});

	function position(node: HTMLElement) {
		function updateCalc() {
			const rect = node.getBoundingClientRect();

			const visibleElements = (
				Array.from(node.children) as HTMLElement[]
			).filter((child, i) => {
				const childRect = child.getBoundingClientRect();

				itemsVisibility[i] =
					childRect.left >= rect.left &&
					childRect.right <= rect.right;

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
				`[${FOCUS_ATTRIBUTE}]`
			) as HTMLButtonElement;

			if (!focusVisibleBtn) return;

			requestAnimationFrame(() => {
				const focusableElements = getFocusableChildren(
					visibleElements[0]
				);

				focusableElements[0]?.focus();

				container.blur();
				focusVisibleBtn.removeAttribute(FOCUS_ATTRIBUTE);
			});
		}

		updateCalc();

		const options = { passive: true };
		node.addEventListener('scroll', handler, options);

		return {
			destroy() {
				// @ts-ignore - see:
				// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
				// https://github.com/microsoft/TypeScript/issues/32912
				node.removeEventListener('scroll', handler, options);
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

	function scrollToElement(el: HTMLElement | null) {
		if (!containerInner || !el) return;

		const newScrollPosition =
			el.offsetLeft +
			el.getBoundingClientRect().width / 2 -
			containerInner.getBoundingClientRect().width / 2;

		containerInner.scroll({
			left: newScrollPosition,
			behavior: 'smooth',
		});
	}

	function scroll(e: Event) {
		const btn = e.currentTarget as HTMLButtonElement;
		const direction = (btn.value || btn.dataset.value) as 'prev' | 'next';

		switch (direction) {
			case 'prev':
				scrollToElement(prevElement);
				break;
			case 'next':
				scrollToElement(nextElement);
				break;
		}
	}

	$: hasItemsOnLeft = rtl ? nextElement !== null : prevElement !== null;
	$: hasItemsOnRight = rtl ? prevElement !== null : nextElement !== null;

	$: cssVars = `
	--has-items-left: ${hasItemsOnLeft ? 'all' : 'hidden'};
	--has-items-right: ${hasItemsOnRight ? 'all' : 'hidden'};
	`;
</script>

<div class="container" bind:this={container} style={cssVars}>
	<slot
		name="left"
		scroll
		setKeyboardFocus
		removeKeyboradFocus
		value={rtl ? 'prev' : 'next'}
	>
		<LeftButton {scroll} {setKeyboardFocus} value={rtl ? 'next' : 'prev'} />
	</slot>

	<div class="inner" bind:this={containerInner} use:position>
		{#each items as item, i}
			<div class="item">
				<slot {item} visible={itemsVisibility[i]} />
			</div>
		{/each}
	</div>

	<slot
		name="right"
		scroll
		setKeyboardFocus
		removeKeyboradFocus
		value={rtl ? 'prev' : 'next'}
	>
		<RightButton
			{scroll}
			{setKeyboardFocus}
			value={rtl ? 'prev' : 'next'}
		/>
	</slot>
</div>

<style lang="scss">
	.container {
		position: relative;
		overflow: hidden;
		// inline margins and paddings wouldn't work correctly
		// if writing mode is set to something else
		writing-mode: horizontal-tb;
	}

	.inner {
		display: flex;
		overflow-x: scroll;

		scroll-behavior: smooth;
		scroll-snap-type: x var(--siema-scroll-snap, mandatory);
		scrollbar-width: none;

		margin-inline-start: -1rem;

		padding: var(--siema-inner-padding, 0.5em 0.3em);

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.item {
		flex: 0 0 auto;
		margin-inline-start: 1rem;
		scroll-snap-align: center;

		// padding: var(--item-padding, 0 0.2vw);
		width: var(--siema-item-width, 100%);
		min-width: var(--siema-item-min-width);
		max-width: var(--siema-item-max-width, 100%);
	}
</style>
