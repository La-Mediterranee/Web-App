import { createEventDispatcher } from 'svelte';

interface LazyLoadOptions {
	once?: boolean;
	observerOptions?: IntersectionObserverInit;
	onIntersection?(target: HTMLElement): void;
}

export default function intersection(node: HTMLElement, options: LazyLoadOptions = {}) {
	const dispatch = createEventDispatcher();

	const { observerOptions, once = true, onIntersection = () => {} } = options || {};

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
