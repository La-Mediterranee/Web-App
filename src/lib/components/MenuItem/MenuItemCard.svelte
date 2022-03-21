<svelte:options immutable />

<!-- tag="product-component" -->
<script context="module" lang="ts">
	import { getProductModalContext } from '$lib/utils';

	import type { CartItem, MenuItem, Topping, ToppingOption } from 'types/product';

	function captureRipple(node: HTMLElement, rippleNode?: HTMLElement) {
		function handleKeyboard(e: KeyboardEvent) {
			const event = new KeyboardEvent(e.type, {
				code: e.code,
				keyCode: e.keyCode,
			});
			rippleNode?.dispatchEvent(event);
		}

		function handleClicks(e: PointerEvent) {
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

	import LL from '$i18n/i18n-svelte';

	import { cart } from '$lib/stores/cart';

	import MenuItemPrice from './MenuItemPrice.svelte';
	import MenuItemName from './MenuItemName.svelte';

	import MenuItemImage from './MenuItemImage.svelte';
	import SmallWave from '$lib/Icons/SmallWave.svelte';
	import MenuItemActions from './MenuItemActions.svelte';

	import type * as schemaDts from 'schema-dts';
	import LdTag from '../LDTag/LDTag.svelte';

	export let product: MenuItem;
	export let locale: string = 'de-DE';
	export let currency: string = 'EUR';
	export let style: string | undefined = undefined;
	export let isVisible = true;

	const modal = getProductModalContext();

	let ctaEl: HTMLDivElement;

	const { image, name, price, category, desc, toppings, type = 'food' } = product;

	const _price = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(price / 100);

	const hasToppings = product.toppings?.length > 0;

	let cta = hasToppings ? $LL.product.chooseOptions() : $LL.product.addToCart();

	const ldJson: schemaDts.WithContext<schemaDts.MenuItem> = {
		'@context': 'https://schema.org',
		'@type': 'MenuItem',
		'name': name,
		'description': desc,
		'image': {
			'@type': 'ImageObject',
		},
		'offers': {
			'@type': 'Offer',
			'price': price,
		},
		'menuAddOn': toppings?.map<schemaDts.MenuSection>(topping => ({
			'@type': 'MenuSection',
			'name': topping.name,
			'description': topping.desc,
			'hasMenuItem': topping.options.map<schemaDts.MenuItem>(option => ({
				'@type': 'MenuItem',
				'name': option.name,
				'description': option.desc,
				'priceCurrency': 'EUR',
				'offers': {
					'@type': 'Offer',
					'price': option.price,
				},
				'suitableForDiet': 'https://schema.org/HalalDiet',
			})),
			'suitableForDiet': 'https://schema.org/HalalDiet',
		})),
	};

	function openPopUp(e: Event) {
		e.preventDefault();
		if (hasToppings) return modal.open(product);

		cart.addItem(
			<CartItem>(<unknown>Object.assign({ quantity: 1, selectedToppings: [] }, product)),
		);
	}
</script>

<LdTag schema={ldJson} />

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
	aria-label={$LL.menuItem.label[type]()}
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
				href="./product/{product.ID}"
				tabindex={isVisible ? undefined : -1}
				captureRipple={node => captureRipple(node, ctaEl)}
				on:click={openPopUp}
			>
				{name}
				<span slot="cta" class="visually-hidden"> - {cta}</span>
			</MenuItemName>

			<MenuItemPrice ariaLabel={$LL.product.price()}>
				<data itemprop="price" value={`${price}`}>{_price}</data>
			</MenuItemPrice>

			<MenuItemActions {ctaEl}>
				<SmallWave slot="prepend" class="wave" />
				{cta}
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
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		// flex: 0 0 auto;
		outline: none;
		position: relative;
		width: var(--product-card-width, 100%);
		height: var(--product-card-height, 100%);
		margin-inline-start: var(--product-card-margin-start, 0);
		margin-inline-end: var(--product-card-margin-end, 0);

		.inner-card {
			position: relative;
			overflow: hidden;
			z-index: 1;
			height: 100%;
		}

		.s-card {
			height: 100%;
		}

		.wave {
			position: absolute;
			top: 0;
			left: 0;
			width: 200%;
			animation: wave linear 3s infinite;

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
