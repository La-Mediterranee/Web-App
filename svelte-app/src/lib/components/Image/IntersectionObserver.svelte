<script lang="ts">
	export let once = false;
	export let top = 0;
	export let bottom = 0;
	export let left = 0;
	export let right = 0;

	import { onMount } from 'svelte';

	let intersecting = false;
	let container: HTMLDivElement;

	const intersectionPolyfill =
		'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.0/intersection-observer.min.js';

	onMount(async () => {
		if (typeof IntersectionObserver !== 'undefined') {
			window.IntersectionObserver = (await import(intersectionPolyfill)).default;

			const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;

			const observer = new IntersectionObserver(
				(entries: IntersectionObserverEntry[]) => {
					intersecting = entries[0].isIntersecting;
					if (intersecting && once) {
						observer.unobserve(container);
					}
				},
				{
					rootMargin,
				}
			);

			observer.observe(container);
			return () => observer.unobserve(container);
		}

		function handler() {
			const bcr = container.getBoundingClientRect();

			intersecting =
				bcr.bottom + bottom > 0 &&
				bcr.right + right > 0 &&
				bcr.top - top < window.innerHeight &&
				bcr.left - left < window.innerWidth;

			if (intersecting && once) {
				window.removeEventListener('scroll', handler);
			}
		}
		window.addEventListener('scroll', handler);
		return () => window.removeEventListener('scroll', handler);
	});
</script>

<div bind:this={container}>
	<slot {intersecting} />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
