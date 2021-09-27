<script lang="ts">
	import { browser } from '$app/env';

	import { onMount } from 'svelte';
	import IntersectionObserver from './IntersectionObserver.svelte';

	export let src: string;
	export let alt: string = '';
	export let width: number;
	export let height: number;
	export let loading: 'eager' | 'lazy' = 'lazy';
	export let decoding: 'async' | 'sync' | 'auto' = 'async';

	let image: HTMLImageElement;
	let loaded = false;
	let nativeLoading = false;

	if (!src) {
		throw new Error('Image source must be defined');
	}

	if (!width || !height) {
		throw new Error(
			'Width and Height must be defined to get a correct aspectratio'
		);
	}

	if (browser && 'loading' in HTMLImageElement.prototype) {
		nativeLoading = true;
	}
</script>

<IntersectionObserver once={true} let:intersecting>
	{#if intersecting || nativeLoading}
		<img
			{loading}
			{decoding}
			{src}
			{alt}
			{height}
			{width}
			class:loaded
			bind:this={image}
			on:load={() => (loaded = true)}
		/>
	{/if}
</IntersectionObserver>

<style>
	img {
		opacity: 0;
		transition: opacity 400ms ease-out;
	}

	img.loaded {
		opacity: 1;
	}
</style>
