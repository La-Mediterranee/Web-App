interface LazyLoad {
	destroy: () => void;
}

export default function lazyLoad(node: HTMLElement, src: string): LazyLoad {
	const observer = new IntersectionObserver(onIntersect, {
		rootMargin: '50px 0px',
		threshold: 0.01,
	});

	function onIntersect(entries: IntersectionObserverEntry[]) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				node.setAttribute('src', src);
			}
		});
	}

	observer.observe(node);

	return {
		destroy() {
			observer && observer.unobserve(node);
		},
	};
}
