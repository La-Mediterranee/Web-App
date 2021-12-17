type ImageLoading = 'auto' | 'eager' | 'lazy';

interface LazyLoadOptions {
	once?: boolean;
	observerOptions?: IntersectionObserverInit;
	onIntersection?: (target: Element) => {};
}

export function lazyload(node: HTMLElement, options: LazyLoadOptions = {}) {
	const { once, observerOptions, onIntersection = () => {} } = options || {};

	const observer = new IntersectionObserver(intersactionHandler, {
		root: observerOptions?.root,
		rootMargin: observerOptions?.rootMargin || '0px',
		threshold: observerOptions?.threshold ?? 0.2,
	});

	observer.observe(node);

	function intersactionHandler(
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			onIntersection(entry.target);
			once && observer.unobserve(node);
		});
	}

	return {
		destroy() {
			observer.unobserve(node);
		},
	};
}

export function lazyloadImage(
	img: HTMLImageElement,
	src?: string,
	options?: IntersectionObserverInit,
	placeholder?: string,
	errorPlaceholder?: string
) {
	const dataSrc = img.dataset.src as string;
	const dataPlaceholder = img.dataset.placeholder as string;
	const dataErrorPlaceholder =
		img.dataset.errorPlaceholder || dataPlaceholder;

	if ('loading' in HTMLImageElement.prototype) {
		loadImage();
		return;
	}

	const loading = (img.getAttribute('loading') || 'lazy') as ImageLoading;

	if (loading === 'auto' || loading === 'eager') {
		loadImage();
		return;
	}

	const opt = {
		once: true,
		observerOptions: options,
		onIntersection: loadImage,
	};

	const observer = lazyload(img, opt);

	async function loadImage() {
		try {
			await fetchImage(dataSrc);
			img.src = dataSrc;
		} catch (error) {
			img.src = dataErrorPlaceholder;
		} finally {
			img.setAttribute('data-loading', 'false');
		}
	}

	return {
		destroy() {
			observer.destroy();
		},
	};
}

async function fetchImage(url: string) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = url;
		image.setAttribute('data-loading', 'true');
		image.onload = resolve;
		image.onerror = reject;
	});
}
