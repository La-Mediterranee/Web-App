<script lang="ts">
	export let src: string;
	export let alt: string;
	export let width: number;
	export let height: number;
	export let loading: 'eager' | 'lazy' = 'lazy';
	export let decoding: 'async' | 'sync' | 'auto' = 'async';

	if (!src) {
		throw new Error('Image source must be defined');
	}

	if (!width || !height) {
		throw new Error('Width and Height must be defined to get a correct aspectratio');
	}

	import { onMount } from 'svelte';
	import IntersectionObserver from './IntersectionObserver.svelte';

	let thisImage: HTMLImageElement;
	let loaded = false;
	let nativeLoading = false;

	onMount(() => {
		if ('loading' in HTMLImageElement.prototype) {
			nativeLoading = true;
		}

		thisImage.onload = () => {
			loaded = true;
		};

		// thisImage.decoding = decoding;
	});
</script>

<IntersectionObserver once={true} let:intersecting>
	{#if intersecting || nativeLoading}
		<img {loading} {decoding} {src} {alt} {height} {width} bind:this={thisImage} class:loaded />
	{/if}
</IntersectionObserver>

<style>
	img {
		height: 200px;
		opacity: 0;
		transition: opacity 1200ms ease-out;
	}

	img.loaded {
		opacity: 1;
	}
</style>
