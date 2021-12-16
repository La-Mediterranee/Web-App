<script context="module" lang="ts">
	import { browser, dev } from '$app/env';
	import { onMount, createEventDispatcher } from 'svelte';

	import { lazyloadImage } from '$lib/actions/lazyload';
	import { toBase64 } from '$lib/utils/to-base-64';

	import { generateImgAttrs, getInt } from './helper';
	import { EMPTY_DATA_URL, TAG, VALID_LAYOUT_VALUES } from './constants';
	import { defaultImageLoader } from './loaders';

	import type {
		DecodingAttribute,
		GenImgAttrsResult,
		Img,
		LayoutValue,
		LoadingAttribute,
		ObjectFitStyle,
		ObjectPositionStyle,
		OnLoadingComplete,
		PlaceholderValue,
	} from './types';

	function handleLoad(
		img: HTMLImageElement,
		options: {
			src: string;
			layout: LayoutValue;
			placeholder: PlaceholderValue;
			onLoadingComplete?: OnLoadingComplete;
			errorHandler?: (e: ErrorEvent) => void;
		}
	) {
		const {
			src,
			layout,
			placeholder,
			onLoadingComplete = () => {},
			errorHandler = () => {},
		} = options;

		async function loadHandler(e?: Event) {
			try {
				if (img.src !== EMPTY_DATA_URL) {
					await ('decode' in img ? img.decode() : Promise.resolve());

					if (placeholder === 'blur') {
						img.style.filter = 'none';
						img.style.backgroundSize = 'none';
						img.style.backgroundImage = 'none';
					}

					loadedImageURLs.add(src);

					const { naturalWidth, naturalHeight } = img;
					// Pass back read-only primitive values but not the
					// underlying DOM element because it could be misused.
					onLoadingComplete({ naturalWidth, naturalHeight });

					if (dev) {
						if (img.parentElement?.parentElement) {
							const parent = getComputedStyle(
								img.parentElement.parentElement
							);

							if (!parent.position) {
								// The parent has not been rendered to the dom yet and therefore it has no position. Skip the warnings for such cases.
							} else if (
								layout === 'responsive' &&
								parent.display === 'flex'
							) {
								console.warn(
									`${TAG} Image with src "${src}" may not render properly as a child of a flex container. Consider wrapping the image with a div to configure the width.`
								);
							} else if (
								layout === 'fill' &&
								parent.position !== 'relative' &&
								parent.position !== 'fixed'
							) {
								console.warn(
									`${TAG} Image with src "${src}" may not render properly with a parent using position:"${parent.position}". Consider changing the parent style to position:"relative" with a width and height.`
								);
							}
						}
					}
				}
			} catch (error) {}
		}

		if (img.complete) {
			loadHandler();
		} else {
			img.addEventListener('load', loadHandler);
			img.addEventListener('error', errorHandler);
		}

		return {
			destroy() {
				img.removeEventListener('load', loadHandler);
				img.addEventListener('error', errorHandler);
			},
		};
	}

	const loadedImageURLs = new Set<string>();
	const allImgs = new Map<string, Img>();
</script>

<script lang="ts">
	let klass = '';
	export { klass as class };
	export let src: string;
	export let width: number = 0;
	export let height: number = 0;
	export let alt: string = '';
	export let loading: LoadingAttribute = 'lazy';
	export let decoding: DecodingAttribute = 'async';
	export let objectFit: ObjectFitStyle = 'cover';
	export let objectPosition: ObjectPositionStyle = '0% 0%';
	export let layout: LayoutValue = 'intrinsic';
	export let lazyBoundary = '200px';

	export let placeholder: PlaceholderValue = 'empty';
	export let errorPlaceholder = ' ';
	export let blurDataURL: string | undefined = undefined;

	export let quality = 75;
	export let priority = false;
	export let unoptimized = false;
	/**
	 * Read More on https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
	 */
	export let sizes: string | undefined = undefined;
	export let loader = defaultImageLoader;

	let isLazy =
		!priority && (loading === 'lazy' || typeof loading === 'undefined');

	if (src.startsWith('data:') || src.startsWith('blob:')) {
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
		unoptimized = true;
		isLazy = false;
	}

	if (window && loadedImageURLs.has(src)) {
		isLazy = false;
	}

	const widthInt = getInt(width);
	const heightInt = getInt(height);
	const qualityInt = getInt(quality);

	const sizerSvg =
		layout === 'intrinsic'
			? `<svg width="${widthInt}" height="${heightInt}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`
			: undefined;

	let image: HTMLImageElement;
	let loaded = false;
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
				`${TAG} "src" property must be defined. Received:  ${JSON.stringify(
					{
						width,
						height,
						quality,
					}
				)}`
			);
		}

		if (layout === 'fill' && (width || height)) {
			console.warn(
				`${TAG} Image with src "${src}" and "layout='fill'" has unused properties assigned. Please remove "width" and "height".`
			);
		}

		if (!VALID_LAYOUT_VALUES.includes(layout)) {
			throw new Error(
				`${TAG} Image with src "${src}" has invalid "layout" property. Provided "${layout}" should be one of ${VALID_LAYOUT_VALUES.map(
					String
				).join(',')}.`
			);
		}

		if (!width || !height) {
			throw new Error(
				`${TAG} Image with src "${src}" width and height must be defined to get a correct aspectratio`
			);
		}

		if (typeof width !== 'number' || typeof height !== 'number') {
			throw new Error(
				`${TAG} Image with src "${src}" have unvalid width and height. They must be of type "number"`
			);
		}

		if (priority && loading === 'lazy') {
			throw new Error(
				`Image with src "${src}" has both "priority" and "loading='lazy'" properties. Only one should be used.`
			);
		}

		if (sizes && layout !== 'fill' && layout !== 'responsive') {
			console.warn(
				`${TAG} Image with src "${src}" has "sizes" property but it will be ignored. Only use "sizes" with "layout='fill'" or "layout='responsive'".`
			);
		}

		if (placeholder === 'blur') {
			if (
				layout !== 'fill' &&
				(widthInt || 0) * (heightInt || 0) < 1600
			) {
				console.warn(
					`${TAG} Image with src "${src}" is smaller than 40x40. Consider removing the "placeholder='blur'" property to improve performance.`
				);
			}
			if (!blurDataURL) {
				const VALID_BLUR_EXT = ['jpeg', 'png', 'webp', 'avif']; // should match next-image-loader
				throw new Error(
					`${TAG} Image with src "${src}" has "placeholder='blur'" property but is missing the "blurDataURL" property.
          Possible solutions:
            - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image
            - Change the "src" property to a static import with one of the supported file types: ${VALID_BLUR_EXT.join(
				','
			)}
            - Remove the "placeholder" property, effectively no blur effect`
				);
			}
		}

		if (!unoptimized) {
			const urlStr = loader({
				src,
				width: widthInt || 400,
				quality: qualityInt || 75,
			});
			let url: URL | undefined;
			try {
				url = new URL(urlStr);
			} catch (err) {}
			if (
				urlStr === src ||
				(url && url.pathname === src && !url.search)
			) {
				console.warn(
					`Image with src "${src}" has a "loader" property that does not implement width. Please implement it or use the "unoptimized" property instead.`
				);
			}
		}

		if (
			typeof window !== 'undefined' &&
			!perfObserver &&
			window.PerformanceObserver
		) {
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
							`${TAG} Image with src "${lcpImage.src}" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.`
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

	const isVisible = !isLazy || isIntersected;

	let imgAttributes: GenImgAttrsResult = {
		src: EMPTY_DATA_URL,
		srcSet: undefined,
		sizes: undefined,
	};

	if (isVisible) {
		imgAttributes = generateImgAttrs({
			src,
			unoptimized,
			layout,
			width: widthInt,
			quality: qualityInt,
			sizes,
			loader,
		});
	}

	if (dev && browser) {
		let fullUrl: URL;
		try {
			fullUrl = new URL(imgAttributes.src);
		} catch (e) {
			fullUrl = new URL(imgAttributes.src, window.location.href);
		}
		allImgs.set(fullUrl.href, { src, priority, placeholder });
	}

	const quotient = (widthInt || 1) / (widthInt || 1);
	const paddingTop = isNaN(quotient) ? '100%' : `${quotient * 100}%`;

	const cssVars = `
	--image-width: ${widthInt};
	--image-height: ${heightInt};
	--image-padding-top: ${paddingTop};
	--image-blur-bg-size: ${objectFit};
	--image-blur-bg-image: url("${blurDataURL}");
	--image-blur-bg-position: ${objectPosition};
	`;

	const noScriptImgAttributes = generateImgAttrs({
		src,
		unoptimized,
		layout,
		width: widthInt,
		quality: qualityInt,
		sizes,
		loader,
	});

	const linkProps = {
		imagesrcset: imgAttributes.srcSet,
		imagesizes: imgAttributes.sizes,
	};

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
			href={imgAttributes.srcSet ? undefined : imgAttributes.src}
			data-key={'__nimg-' +
				imgAttributes.src +
				imgAttributes.srcSet +
				imgAttributes.sizes}
			{...linkProps}
		/>
	{/if}
</svelte:head>

<!-- 
class:fill={layout === 'fill'}
class:fixed={layout === 'fixed'}
class:responsive={layout === 'responsive'} 
class:intrinsic={layout === 'intrinsic'}
-->

<span style={cssVars} class={`img-wrapper ${layout ? layout : ''}`}>
	<span
		style={hasSizer ? '' : 'display: none;'}
		class={`img-sizer ${layout ? layout : ''}`}
		aria-hidden={true}
	>
		<img
			{decoding}
			class="img-sizer-svg"
			src={`data:image/svg+xml;base64,${toBase64(sizerSvg)}`}
			alt="Hidden SVG"
			aria-hidden={true}
		/>
	</span>
	<img
		{loading}
		{decoding}
		{alt}
		{height}
		{width}
		{...imgAttributes}
		class={`img ${klass}`}
		class:img-blur={placeholder === 'blur'}
		data-nimg={layout}
		bind:this={image}
		use:handleLoad={{
			src: src,
			layout: layout,
			placeholder: placeholder,
			onLoadingComplete: e => {
				dispatch('load', e);
			},
			errorHandler: e => {
				dispatch('error', e);
			},
		}}
	/>
	<noscript>
		<img
			{...noScriptImgAttributes}
			{alt}
			{loading}
			{decoding}
			class={`img ${klass}`}
			data-nimg={layout}
		/>
	</noscript>
</span>

<style lang="scss">
	.img {
		position: 'absolute';
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		box-sizing: 'border-box';
		padding: 0;
		border: 'none';
		margin: 'auto';

		display: 'block';
		width: 0;
		height: 0;
		min-width: '100%';
		max-width: '100%';
		min-height: '100%';
		max-height: '100%';

		object-fit: var(--image-blur-bg-size);
		object-position: var(--image-blur-bg-position);

		&-blur {
			filter: blur(20px);
			background-size: var(--image-blur-bg-size, 'cover');
			background-image: var(--image-blur-bg-image);
			background-position: var(--image-blur-bg-position, '0% 0%');
		}

		&-sizer-svg {
			display: 'block';
			max-width: '100%';
			width: 'initial';
			height: 'initial';
			background: 'none';
			opacity: 1;
			border: 0;
			margin: 0;
			padding: 0;
		}

		&-wrapper,
		&-sizer {
			display: 'block';
			width: 'initial';
			height: 'initial';
			background: 'none';
			opacity: 1;
			border: 0;
			margin: 0;
			padding: 0;
		}

		&-wrapper {
			overflow: 'hidden';

			&.fill {
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}

			&.responsive {
				display: 'block';
				position: 'relative';
			}

			&.intrinsic {
				display: inline-block;
				position: relative;
				max-width: 100%;
			}

			&.fixed {
				display: 'inline-block';
				position: 'relative';
				width: var(--image-width);
				height: var(--image-height);
			}
		}

		&-sizer {
			&.responsive {
				padding-top: (--image-paddin-top, 100%);
			}

			&.intrinsic {
				max-width: 100%;
			}
		}
	}
</style>
