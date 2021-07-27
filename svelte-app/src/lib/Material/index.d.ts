declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onintersect?: (
			e: CustomEvent<{ detail: IntersectionObserverEntry }>
		) => void;
	}
}
