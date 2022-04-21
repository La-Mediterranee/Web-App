<svelte:options immutable />

<!-- tag="product-component" -->
<script context="module" lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';

	import SmallWave from '$lib/Icons/SmallWave.svelte';
	import LdTag from '../LDTag/LDTag.svelte';
	import ItemInfoBtnContainer from './ItemInfoBtnContainer.svelte';
	import MenuItemActions from './MenuItemActions.svelte';
	import MenuItemDesc from './MenuItemDesc.svelte';
	import MenuItemImage from './MenuItemImage.svelte';
	import MenuItemInfoBtn from './MenuItemInfoBtn.svelte';
	import MenuItemInnerCard from './MenuItemInnerCard.svelte';
	import MenuItemName from './MenuItemName.svelte';
	import MenuItemPrice from './MenuItemPrice.svelte';

	import { createEventDispatcher, onMount } from 'svelte';

	import { getAnimationsContext } from '$lib/stores/animations';
	import { menuitem } from '$lib/utils/seo/schema/menuitem';

	import type * as schemaDts from 'schema-dts';
	import type { MenuItem } from 'types/product';
	import type { LocalizedString } from 'typesafe-i18n';

	function captureRipple(node: HTMLElement, rippleNode?: HTMLElement) {
		function handleKeyboard(e: KeyboardEvent) {
			const event = new KeyboardEvent(e.type, {
				code: e.code,
				keyCode: e.keyCode,
			});
			rippleNode?.dispatchEvent(event);
		}

		function handleClicks(e: PointerEvent) {
			if (e.type === 'pointerleave') {
				node?.blur();
				rippleNode?.classList.remove('click');
			} else {
				rippleNode?.classList.add('click');
			}

			const event = new PointerEvent(e.type, {
				clientX: e.clientX,
				clientY: e.clientY,
			});

			rippleNode?.dispatchEvent(event);
		}

		node.addEventListener('pointerdown', handleClicks);
		node.addEventListener('pointerup', handleClicks);
		node.addEventListener('pointerleave', handleClicks);
		node.addEventListener('keydown', handleKeyboard);
		node.addEventListener('keyup', handleKeyboard);

		function destroy() {
			node.removeEventListener('pointerdown', handleClicks);
			node.removeEventListener('pointerup', handleClicks);
			node.removeEventListener('pointerleave', handleClicks);
			node.removeEventListener('keydown', handleKeyboard);
			node.removeEventListener('keyup', handleKeyboard);
		}

		return {
			update(newRippleNode: HTMLElement) {
				rippleNode = newRippleNode;
			},
			destroy,
		};
	}

	type EventDispatcher<
		EventType extends Extract<keyof EventMap, string>,
		EventMap extends {} = any,
	> = (type: EventType, detail?: EventMap[EventType]) => void;

	function clickHandler(card: HTMLElement, dispatch: EventDispatcher<string>, details: any = {}) {
		const box = card.getBoundingClientRect();
		const bodyRect = document.body.getBoundingClientRect();
		const _details = Object.assign(
			{
				top: box.top + window.pageYOffset,
				left: box.left - window.innerWidth / 2,
			},
			details,
		);

		dispatch('click', _details);
	}
</script>

<script lang="ts">
	export let item: MenuItem;
	export let href: string;
	export let label: {
		item: string | LocalizedString;
		price: string | LocalizedString;
	};
	export let style: string | undefined = undefined;
	export let isVisible = true;
	export let itemprop: string | undefined = undefined;

	export let card: HTMLElement | undefined = undefined;

	$: tabindex = isVisible ? 0 : -1;

	const { image, name, price, category, desc, toppings } = item;

	let ctaEl: HTMLDivElement;
	let waveEl: SVGSVGElement;

	const animations = getAnimationsContext();
	const dispatch = createEventDispatcher();

	onMount(() => {
		const unsub = animations.subscribe(() => {});
		const pop = animations.push(waveEl);

		return () => {
			pop();
			unsub();
		};
	});

	const handler = () => clickHandler(card!, dispatch, { item });

	// const ldJson = menuitem(item);
</script>

<!-- <LdTag schema={ldJson} /> -->

<!--
	An article is better for semantic because a product card
	is self contained and can be taken out of the page
	and still make sense. "mediamarkt.at" also uses it for their
	cards.

	other resources:
	- https://stackoverflow.com/questions/46259821/which-html5-tags-are-semantically-correct-to-represent-e-commerce-products

 -->
<article
	bind:this={card}
	itemscope
	{itemprop}
	itemtype="http://schema.org/MenuItem"
	aria-label={label?.item}
	class="menuitem-card-container"
	{style}
>
	<Card raised>
		<link itemprop="url" content={href} />
		<MenuItemInnerCard>
			<main>
				<MenuItemImage {image} />
				<MenuItemName
					{href}
					{captureRipple}
					{tabindex}
					captureRippleNode={ctaEl}
					on:click={handler}
				>
					<slot name="name" />
					<span slot="cta" class="visually-hidden">
						-
						<slot name="cta" />
					</span>
				</MenuItemName>

				<MenuItemPrice ariaLabel={label?.price}>
					<slot name="price" />
				</MenuItemPrice>

				{#if desc}
					<MenuItemDesc>
						{desc}
					</MenuItemDesc>
				{/if}
			</main>

			<MenuItemActions bind:ctaEl>
				<SmallWave bind:el={waveEl} slot="prepend" class="wave" />
				<slot name="cta" />
			</MenuItemActions>

			<ItemInfoBtnContainer>
				<MenuItemInfoBtn {tabindex} on:click={() => dispatch('info', { item })}>
					More Info
				</MenuItemInfoBtn>
			</ItemInfoBtnContainer>
		</MenuItemInnerCard>
	</Card>
	<meta itemprop="suitableForDiet" content="https://schema.org/HalalDiet" />
</article>

<style lang="scss" global>
	.red.darken-5 {
		// background-color: #e32a00 !important;
		// border-color: #e32a00 !important;
		background-color: #dd3900 !important;
		border-color: #dd3900 !important;
	}

	.menuitem-card-container {
		// display: flex;
		// flex-wrap: wrap;
		// flex-direction: column;
		// flex: 0 0 auto;

		--wave-color: #278cc5;
		position: relative;

		width: var(--product-card-width, 100%);
		height: var(--product-card-height, 100%);

		margin-inline-start: var(--product-card-margin-start, 0);
		margin-inline-end: var(--product-card-margin-end, 0);

		:global(.s-card) {
			height: 100%;
		}

		main {
			position: relative;
			width: 100%;
		}

		.wave {
			position: absolute;
			top: 0;
			left: 0;
			width: 200%;
			animation: wave linear 3s infinite;
			transform: translateZ(0);
			will-change: transform;
			animation-play-state: var(--animps, paused);

			@media (prefers-reduced-motion: no-preference) {
				--animps: running;
			}

			@media screen and (min-width: 450px) and (any-hover: none) and (pointer: coarse) {
				--animps: paused;
				// animation: wave linear 4s infinite;
			}

			// @media (prefers-reduced-motion: no-preference) {
			// 	animation-play-state: running;
			// }
		}

		@media screen and (any-hover: hover) and (pointer: fine) {
			--actions-transition-duration: 750ms;

			main {
				height: var(--product-card-height, 100%);
			}

			.wave {
				--animps: paused;
			}

			&:focus-within,
			&:hover {
				@media (prefers-reduced-motion: no-preference) {
					.wave {
						--animps: running;
					}
				}
			}
		}
	}

	@keyframes wave {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(-50%);
		}
	}
</style>
