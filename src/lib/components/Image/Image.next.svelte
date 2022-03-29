<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { createEventDispatcher, onMount } from 'svelte';
	import { EMPTY_DATA_URL, handleLoad, intersection, TAG, VALID_LAYOUT_VALUES } from './actions';

	import type {
		LayoutValue,
		ObjectFitStyle,
		ObjectPositionStyle,
		PlaceholderValue,
	} from './image';

	interface Img {
		src: string;
		priority: boolean;
		placeholder: string;
	}

	interface GenImgAttrsResult {
		src: string;
		srcset: Attributes<HTMLImageElement>['srcset'];
		sizes: Attributes<HTMLImageElement>['sizes'];
	}

	type Unobserver = (node: HTMLImageElement) => void;
	type MountFn = (options: {
		image: HTMLImageElement;
		imgAttributes: GenImgAttrsResult;
		placeholder: PlaceholderValue;
		src: string;
	}) => Unobserver;

	interface MountFnOptions {
		image: HTMLImageElement;
		imgAttributes: GenImgAttrsResult;
		placeholder: PlaceholderValue;
		src: string;
	}

	const mountFn: MountFn =
		<MountFn>(<unknown>browser) &&
		('loading' in HTMLImageElement.prototype
			? ({ image }: MountFnOptions) => {
					image.dispatchEvent(createIntersectionEvent(image));
					return () => {};
			  }
			: (options: MountFnOptions) => {
					let fullUrl: URL;
					try {
						fullUrl = new URL(options.imgAttributes.src);
					} catch (e) {
						fullUrl = new URL(options.imgAttributes.src, window.location.href);
					}

					return observe(options.image, {
						src: options.src,
						href: fullUrl.href,
						placeholder: options.placeholder,
					});
			  });

	const allImgs = new Map<string, Img>();
	const images = new Map<HTMLImageElement, any>();
	const observe = browser ? createIntersectionObserver() : () => () => {};

	function createIntersectionObserver(options?: IntersectionObserverInit) {
		const observer = new IntersectionObserver(intersactionHandler, {
			root: options?.root,
			rootMargin: options?.rootMargin || '200px',
			threshold: options?.threshold || 0.2,
		});

		function intersactionHandler(
			entries: IntersectionObserverEntry[],
			observer: IntersectionObserver,
		) {
			entries.forEach(entry => {
				if (!entry.isIntersecting || entry.intersectionRatio <= 0) return;
				const image = <HTMLImageElement>entry.target;
				image.dispatchEvent(createIntersectionEvent(image));
				observer.unobserve(image);
			});
		}

		function unobserve(node: HTMLImageElement) {
			images.delete(node);
			observer.unobserve(node);
			if (images.size === 0) observer.disconnect();
		}

		return function observe(node: HTMLImageElement, value: any) {
			images.set(node, value);
			observer.observe(node);

			return unobserve;
		};
	}

	function getInt(x: unknown): number | undefined {
		switch (typeof x) {
			case 'number':
				return x;
			case 'string':
				return parseInt(x, 10);
			default:
				return undefined;
		}
	}

	function createIntersectionEvent<T>(detail: T) {
		return new CustomEvent('intersection', {
			bubbles: false,
			cancelable: false,
			composed: false,
			detail,
		});
	}
</script>

<script lang="ts">
	let klass = '';
	export { klass as class };
	export let image: HTMLImageElement | undefined = undefined;

	export let src: string = '';
	export let alt: Attributes<HTMLImageElement>['alt'] = '';

	export let width: Attributes<HTMLImageElement>['width'] = 0;
	export let height: Attributes<HTMLImageElement>['height'] = 0;

	export let loading: HTMLImageElement['loading'] = 'lazy';
	export let decoding: Attributes<HTMLImageElement>['decoding'] = 'async';
	export let objectFit: ObjectFitStyle = 'cover';
	export let objectPosition: ObjectPositionStyle = '0% 0%';
	export let layout: LayoutValue = 'intrinsic';
	export let lazyBoundary = '200px';

	export let placeholder: PlaceholderValue = 'empty';
	export let errorPlaceholder: string | undefined = undefined;
	export let blurDataURL: string | undefined = undefined;

	export let priority = false;
	/**
	 * Read More on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes and
	 * https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
	 */
	export let sizes: Attributes<HTMLImageElement>['sizes'] = undefined;
	export let srcset: Attributes<HTMLImageElement>['srcset'] = undefined;

	let isLazy = !priority && (loading === 'lazy' || typeof loading === 'undefined');

	if (src.startsWith('data:') || src.startsWith('blob:')) {
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
		isLazy = false;
	}

	const widthInt = getInt(width);
	const heightInt = getInt(height);

	const sizerSvg =
		layout === 'intrinsic'
			? `data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27${widthInt}%27%20height=%27${heightInt}%27/%3e`
			: undefined;

	let perfObserver: PerformanceObserver | undefined;

	let hasSizer = false;
	switch (layout) {
		case 'responsive':
			hasSizer = true;
			break;
		case 'intrinsic':
			hasSizer = true;
			break;
		case 'fill':
			hasSizer = false;
			break;
		case 'fixed':
			hasSizer = false;
			break;
		default:
			if (dev) {
				const msg = `${TAG} Image with src "${src}" must use "width" and "height" properties or "layout='fill'" property.`;
				throw new Error(msg);
			}
			break;
	}

	if (dev) {
		if (!src) {
			throw new Error(
				`${TAG} "src" property must be defined. Received:  ${JSON.stringify({
					width,
					height,
				})}`,
			);
		}

		if (layout === 'fill' && (width || height)) {
			console.warn(
				`${TAG} Image with src "${src}" and "layout='fill'" has unused properties assigned. Please remove "width" and "height".`,
			);
		}

		if (!VALID_LAYOUT_VALUES.includes(layout)) {
			throw new Error(
				`${TAG} Image with src "${src}" has invalid "layout" property. Provided "${layout}" should be one of ${VALID_LAYOUT_VALUES.map(
					String,
				).join(',')}.`,
			);
		}

		if (!width || !height) {
			throw new Error(
				`${TAG} Image with src "${src}" width and height must be defined to get a correct aspectratio`,
			);
		}

		if (typeof width !== 'number' || typeof height !== 'number') {
			throw new Error(
				`${TAG} Image with src "${src}" has invalid width and height. They must be of type "number"`,
			);
		}

		if (priority && loading === 'lazy') {
			throw new Error(
				`Image with src "${src}" has both "priority" and "loading='lazy'" properties. Only one should be used.`,
			);
		}

		if (sizes && layout !== 'fill' && layout !== 'responsive') {
			console.warn(
				`${TAG} Image with src "${src}" has "sizes" property but it will be ignored. Only use "sizes" with "layout='fill'" or "layout='responsive'".`,
			);
		}

		if (placeholder === 'blur') {
			if (layout !== 'fill' && (widthInt || 0) * (heightInt || 0) < 1600) {
				console.warn(
					`${TAG} Image with src "${src}" is smaller than 40x40. Consider removing the "placeholder='blur'" property to improve performance.`,
				);
			}
			if (!blurDataURL) {
				const VALID_BLUR_EXT = ['jpeg', 'png', 'webp', 'avif']; // should match next-image-loader
				throw new Error(
					`${TAG} Image with src "${src}" has "placeholder='blur'" property but is missing the "blurDataURL" property.
          Possible solutions:
            - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image
            - Change the "src" property to a static import with one of the supported file types: ${VALID_BLUR_EXT.join(
				',',
			)}
            - Remove the "placeholder" property, effectively no blur effect`,
				);
			}
		}

		if (browser && !perfObserver && window.PerformanceObserver) {
			perfObserver = new PerformanceObserver(entryList => {
				for (const entry of entryList.getEntries()) {
					// @ts-ignore - missing "LargestContentfulPaint" class with "element" prop
					const imgSrc = entry?.element?.src || '';
					const lcpImage = allImgs.get(imgSrc);
					if (
						lcpImage &&
						!lcpImage.priority &&
						lcpImage.placeholder !== 'blur' &&
						!lcpImage.src.startsWith('data:') &&
						!lcpImage.src.startsWith('blob:')
					) {
						// https://web.dev/lcp/#measure-lcp-in-javascript
						console.warn(
							`${TAG} Image with src "${lcpImage.src}" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.`,
						);
					}
				}
			});
			perfObserver.observe({
				type: 'largest-contentful-paint',
				buffered: true,
			});
		}
	}

	let isIntersected = false;

	let imgAttributes: GenImgAttrsResult = {
		src: EMPTY_DATA_URL,
		srcset: undefined,
		sizes: undefined,
	};

	$: isVisible = !isLazy || isIntersected;

	$: imgAttributes = isVisible
		? {
				src,
				srcset,
				sizes,
		  }
		: imgAttributes;

	if (dev && browser) {
		let fullUrl: URL;
		try {
			fullUrl = new URL(imgAttributes.src);
		} catch (e) {
			fullUrl = new URL(imgAttributes.src, window.location.href);
		}
		allImgs.set(fullUrl.href, { src, priority, placeholder });
	}

	onMount(() => {
		const unobserve = mountFn({
			image: <HTMLImageElement>image,
			src,
			imgAttributes,
			placeholder,
		});

		return () => {
			unobserve(<HTMLImageElement>image);
		};
	});

	const quotient = (heightInt || 1) / (widthInt || 1);
	const paddingTop = isNaN(quotient) ? '100%' : `${quotient * 100}%`;

	const dispatch = createEventDispatcher();
</script>

<svelte:head>
	<!-- 
	Note how we omit the `href` attribute, as it would only be relevant
    for browsers that do not support `imagesrcset`, and in those cases
    it would likely cause the incorrect image to be preloaded.
    https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset -->
	{#if priority}
		<link
			rel="preload"
			as="image"
			href={imgAttributes.srcset ? undefined : imgAttributes.src}
			data-key={'__kimg-' +
				imgAttributes.src +
				(imgAttributes.srcset || '') +
				(imgAttributes.sizes || '')}
		/>
	{/if}
</svelte:head>

<!-- style={cssVars} -->
<span
	style:--image-width="{widthInt || 0}px"
	style:--image-height="{heightInt || 0}px"
	style:--_image-padding-top={paddingTop}
	style:--image-blur-bg-size={objectFit}
	style:--image-blur-bg-image={`url("${blurDataURL || ''}")`}
	style:--image-blur-bg-position={objectPosition}
	class={`img-wrapper ${layout ? layout : ''}`}
>
	<span
		style={hasSizer ? '' : 'display: none;'}
		class={`img-sizer ${layout ? layout : ''}`}
		aria-hidden={true}
	>
		<img
			{decoding}
			src={sizerSvg}
			alt="Hidden SVG"
			class="img-sizer-svg"
			style={sizerSvg ? undefined : 'display: none;'}
			aria-hidden={true}
		/>
	</span>
	<img
		bind:this={image}
		{loading}
		{decoding}
		{alt}
		{height}
		{width}
		{...imgAttributes}
		{...$$restProps}
		class={`img ${klass}`}
		class:img-blur={placeholder === 'blur'}
		data-kimg={layout}
		use:handleLoad={{
			isVisible,
			src: src,
			layout: layout,
			placeholder: placeholder,
			onLoadingComplete: e => {
				dispatch('load', e);
			},
			errorHandler: (img, e) => {
				console.error(e);
				errorPlaceholder && (img.src = errorPlaceholder);
				dispatch('error', e);
			},
		}}
		on:intersection={() => {
			isIntersected = true;
		}}
	/>
	<!-- use:intersection={{
			observerOptions: {
				rootMargin: lazyBoundary,
			},
			onIntersection: _ => {
				isIntersected = true;
			},
		}} -->
	<noscript>
		<img
			{src}
			{srcset}
			{sizes}
			{alt}
			{decoding}
			class={`img ${klass}`}
			data-kimg={layout}
			{...$$restProps}
		/>
	</noscript>
</span>

<style lang="scss">
	.img {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		box-sizing: border-box;
		padding: 0;
		border: none;
		margin: auto;

		display: block;
		width: 0;
		height: 0;
		min-width: 100%;
		max-width: 100%;
		min-height: 100%;
		max-height: 100%;

		object-fit: var(--image-blur-bg-size);
		object-position: var(--image-blur-bg-position);

		&-blur {
			filter: blur(20px);
			background-size: var(--image-blur-bg-size, cover);
			background-image: var(--image-blur-bg-image);
			background-position: var(--image-blur-bg-position, 0% 0%);
		}

		&-sizer-svg {
			display: block;
			max-width: 100%;
			width: initial;
			height: initial;
			background: none;
			opacity: 1;
			border: 0;
			margin: 0;
			padding: 0;
		}

		&-wrapper,
		&-sizer {
			display: block;
			width: initial;
			height: initial;
			background: none;
			opacity: 1;
			border: 0;
			margin: 0;
			padding: 0;
		}

		&-wrapper {
			overflow: hidden;
			margin: var(--image-margin);

			&.fill {
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}

			&.responsive {
				display: block;
				position: relative;
			}

			&.intrinsic {
				display: inline-block;
				position: relative;
				max-width: 100%;
			}

			&.fixed {
				display: inline-block;
				position: relative;
				width: var(--image-width);
				height: var(--image-height);
			}
		}

		&-sizer {
			&.responsive {
				padding-top: var(--_image-padding-top, 100%);
			}

			&.intrinsic {
				max-width: 100%;
			}
		}
	}
</style>
