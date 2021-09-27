<script lang="ts">
	import type { Subscriber } from 'svelte/store';

	export let placeholderHeight = 0;
	export let visibleOffset = 1000;
	export let root: Element | Document | null | undefined = null;

	let isVisible = false;
	let intersectionRef: HTMLDivElement | null = null;
	let unobserveReference: SvelteStore<any>;

	const useEffect = (subscribe: Subscriber<any>) => ({ subscribe });

	$: unobserveReference = useEffect(isInterecting(intersectionRef));

	$: $unobserveReference;

	$: changePlaceholder(isVisible, intersectionRef);

	function isInterecting(intersectionRef: HTMLDivElement | null) {
		if (intersectionRef) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (
						typeof window !== undefined &&
						window.requestIdleCallback
					) {
						window.requestIdleCallback(
							() => (isVisible = entries[0].isIntersecting),
							{
								timeout: 600,
							}
						);
					} else {
						isVisible = entries[0].isIntersecting;
					}
				},
				{
					root,
					rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px`,
				}
			);
			observer.observe(intersectionRef);

			return () => {
				if (intersectionRef) {
					observer.unobserve(intersectionRef);
				}
			};
		}
		return () => {};
	}

	function changePlaceholder(
		isVisible: boolean,
		intersectionRef: HTMLDivElement | null
	) {
		if (intersectionRef && isVisible) {
			placeholderHeight = intersectionRef.offsetHeight;
		}
	}
</script>

<div bind:this={intersectionRef}>
	{#if isVisible}
		<slot />
	{:else}
		<div style="height: placeholderHeight" />
	{/if}
</div>
