import { dev } from '$app/env';
import { createEventDispatcher } from 'svelte';
import type { LayoutValue, OnLoadingComplete, PlaceholderValue } from './image';

export const EMPTY_DATA_URL =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
export const TAG = 'IMAGE COMPONENT:';
export const VALID_LAYOUT_VALUES = ['fill', 'fixed', 'intrinsic', 'responsive', undefined] as const;

interface HandleOptions {
	isVisible: boolean;
	src: string;
	layout: LayoutValue;
	placeholder: PlaceholderValue;
	onLoadingComplete?: OnLoadingComplete;
	errorHandler?: (img: HTMLImageElement, e: ErrorEvent | Error) => void;
}

export function handleLoad(img: HTMLImageElement, options: HandleOptions) {
	const {
		src,
		layout,
		placeholder,
		onLoadingComplete = () => {},
		errorHandler = () => {},
	} = options;

	async function loadHandler(e?: Event) {
		try {
			if (img.src === EMPTY_DATA_URL) return;

			await ('decode' in img ? img.decode() : Promise.resolve());

			if (placeholder === 'blur') {
				img.classList.remove('img-blur');
				// img.style.filter = 'none';
				// img.style.backgroundSize = 'none';
				// img.style.backgroundImage = 'none';
			}

			const { naturalWidth, naturalHeight } = img;
			// Pass back read-only primitive values but not the
			// underlying DOM element because it could be misused.
			onLoadingComplete({ naturalWidth, naturalHeight });

			if (dev) {
				if (img.parentElement?.parentElement) {
					const parent = getComputedStyle(img.parentElement.parentElement);

					if (!parent.position) {
						// The parent has not been rendered to the dom yet and therefore it has no position. Skip the warnings for such cases.
					} else if (layout === 'responsive' && parent.display === 'flex') {
						console.warn(
							`${TAG} Image with src "${src}" may not render properly as a child of a flex container. Consider wrapping the image with a div to configure the width.`,
						);
					} else if (
						layout === 'fill' &&
						parent.position !== 'relative' &&
						parent.position !== 'fixed'
					) {
						console.warn(
							`${TAG} Image with src "${src}" may not render properly with a parent using position:"${parent.position}". Consider changing the parent style to position:"relative" with a width and height.`,
						);
					}
				}
			}
		} catch (error) {
			errorHandler(img, error as Error);
		}
	}

	const onErrorHandler = (e: ErrorEvent) => errorHandler(img, e);

	function createImgLoadHandler() {
		if (img.complete) {
			loadHandler();
		} else {
			img.addEventListener('load', loadHandler);
			img.addEventListener('error', onErrorHandler);
		}

		return function destroy() {
			img.removeEventListener('load', loadHandler);
			img.addEventListener('error', onErrorHandler);
		};
	}

	let destroy = createImgLoadHandler();

	return {
		update(newOptions: HandleOptions) {
			options = newOptions;
			destroy();
			destroy = createImgLoadHandler();
		},
		destroy: destroy,
	};
}

interface LazyLoadOptions {
	once?: boolean;
	observerOptions?: IntersectionObserverInit;
	onIntersection?: (target: HTMLElement) => void;
}

export function intersection(node: HTMLElement, options: LazyLoadOptions = {}) {
	const { observerOptions, once = true, onIntersection = () => {} } = options || {};

	if ('loading' in HTMLImageElement.prototype) return onIntersection(node);

	const dispatch = createEventDispatcher();

	const observer = new IntersectionObserver(intersactionHandler, {
		root: observerOptions?.root,
		rootMargin: observerOptions?.rootMargin || '0px',
		threshold: observerOptions?.threshold ?? 0.2,
	});

	observer.observe(node);

	function intersactionHandler(
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver,
	) {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			dispatch('intersection', entry.target as HTMLElement);
			onIntersection(entry.target as HTMLElement);
			once && observer.unobserve(node);
		});
	}

	return {
		destroy() {
			observer.unobserve(node);
		},
	};
}
