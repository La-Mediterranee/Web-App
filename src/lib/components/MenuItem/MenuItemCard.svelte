<svelte:options immutable />

<!-- tag="product-component" -->
<script context="module" lang="ts">
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
</script>

<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';

	import MenuItemName from './MenuItemName.svelte';
	import MenuItemPrice from './MenuItemPrice.svelte';
	import MenuItemImage from './MenuItemImage.svelte';
	import MenuItemActions from './MenuItemActions.svelte';
	import SmallWave from '$lib/Icons/SmallWave.svelte';

	import LdTag from '../LDTag/LDTag.svelte';
	import { getAnimationsContext } from '$lib/stores/animations';
	import { onMount } from 'svelte';

	export let product: MenuItem;
	export let href: string;
	export let label: {
		item: string | LocalizedString;
		price: string | LocalizedString;
	};
	export let style: string | undefined = undefined;
	export let isVisible = true;

	const { image, name, price, category, desc, toppings } = product;

	let ctaEl: HTMLDivElement;
	let waveEl: SVGSVGElement;

	const animations = getAnimationsContext();

	onMount(() => {
		const unsub = animations.subscribe(() => {});
		const pop = animations.push(waveEl);

		return () => {
			pop();
			unsub();
		};
	});

	// const ldJson: schemaDts.WithContext<schemaDts.MenuItem> = {
	// 	'@context': 'https://schema.org',
	// 	'@type': 'MenuItem',
	// 	'name': name,
	// 	'description': desc,
	// 	'image': {
	// 		'@type': 'ImageObject',
	// 	},
	// 	'offers': {
	// 		'@type': 'Offer',
	// 		'price': price,
	// 	},
	// 	'menuAddOn': toppings?.map<schemaDts.MenuSection>(topping => ({
	// 		'@type': 'MenuSection',
	// 		'name': topping.name,
	// 		'description': topping.desc,
	// 		'hasMenuItem': topping.options.map<schemaDts.MenuItem>(option => ({
	// 			'@type': 'MenuItem',
	// 			'name': option.name,
	// 			'description': option.desc,
	// 			'priceCurrency': 'EUR',
	// 			'offers': {
	// 				'@type': 'Offer',
	// 				'price': option.price,
	// 			},
	// 			'suitableForDiet': 'https://schema.org/HalalDiet',
	// 		})),
	// 		'suitableForDiet': 'https://schema.org/HalalDiet',
	// 	})),
	// };
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
	itemscope
	itemtype="http://schema.org/MenuItem"
	aria-label={label?.item}
	class="menuitem-card-container"
	{style}
>
	<Card raised>
		<div class="inner-card">
			<MenuItemImage
				src={image.src}
				alt={image.alt || name}
				height={image.height}
				width={image.width}
			/>

			<MenuItemName
				{href}
				{captureRipple}
				captureRippleNode={ctaEl}
				tabindex={isVisible ? undefined : -1}
				on:click
			>
				<slot />
				<span slot="cta" class="visually-hidden">
					-
					<slot name="cta" />
				</span>
			</MenuItemName>

			<MenuItemPrice ariaLabel={label?.price}>
				<slot name="price" />
			</MenuItemPrice>

			<MenuItemActions bind:ctaEl>
				<SmallWave bind:el={waveEl} slot="prepend" class="wave" />
				<slot name="cta" />
			</MenuItemActions>
		</div>
	</Card>
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
		position: relative;

		width: var(--product-card-width, 100%);
		height: var(--product-card-height, 100%);

		margin-inline-start: var(--product-card-margin-start, 0);
		margin-inline-end: var(--product-card-margin-end, 0);

		.inner-card {
			position: relative;
			overflow: hidden;
			height: 100%;
			z-index: 1;
		}

		.wave {
			position: absolute;
			top: 0;
			left: 0;
			width: 200%;
			animation: wave linear 3s infinite;
			transform: translateZ(0);
			will-change: transform;

			@media (prefers-reduced-motion: no-preference) {
				animation-play-state: running;
			}
		}

		@media (any-hover: hover) and (pointer: fine) {
			--actions-transition-duration: 750ms;

			.wave {
				animation-play-state: paused;
			}

			&:focus-within,
			&:hover {
				@media (prefers-reduced-motion: no-preference) {
					.wave {
						animation-play-state: running;
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
