export interface IntersectOptions extends IntersectionObserverInit {
	once: boolean;
}

export default (node: Element, options?: IntersectOptions) => {
	const s: IntersectionObserverInit = {};
	const settings = { once: false, ...options };
	const observer = new IntersectionObserver((entries) => {
		const entry = entries[0];
		const intersecting = entry.isIntersecting;
		if (intersecting) {
			node.dispatchEvent(
				new CustomEvent("intersect", {
					detail: entry,
				})
			);
			if (settings.once) {
				observer.unobserve(node);
			}
		}
	}, settings);
	observer.observe(node);
	return {
		destroy() {
			observer.unobserve(node);
		},
	};
};
