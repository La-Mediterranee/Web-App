interface LazyLoadOptions {
	once?: boolean;
	observerOptions?: IntersectionObserverInit;
	onIntersection?: (target: HTMLElement) => {};
}

export default function intersection(
	node: HTMLElement,
	options: LazyLoadOptions = {}
) {
	const {
		observerOptions,
		once = true,
		onIntersection = () => {},
	} = options || {};

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
