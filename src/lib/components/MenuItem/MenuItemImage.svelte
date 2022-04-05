<script lang="ts">
	import Image from '$lib/components/Image/Image.next.svelte';

	type CrossOrigin = 'anonymous' | 'use-credentials' | '';

	export let src: string;
	export let alt: string;
	export let width: number = 640;
	export let height: number = 480;
	export let crossorigin: CrossOrigin | undefined = undefined;
</script>

<div class="img">
	<Image
		itemprop="image"
		{src}
		{alt}
		{width}
		{height}
		{crossorigin}
		layout="responsive"
		objectFit="scale-down"
		objectPosition="center"
	/>
</div>

<!-- <img itemprop="image" loading="lazy" decoding="async" {src} {alt} {width} {height} /> -->
<style lang="scss">
	img {
		position: relative;
		width: 100%;
		max-width: 100%;
		height: auto;
		border-top-right-radius: inherit;
		border-top-left-radius: inherit;
		margin-bottom: 0.6em;

		transition: transform 500ms ease;
	}

	.img {
		display: block;
		position: relative;
		height: var(--menu-item-img-height);
		width: var(--menu-item-img-width, var(--product-card-width, 100%));

		margin: 0 auto;
		margin-block-start: var(--menu-item-img-mbs);
		margin-block-end: 0.6em;

		:global(img) {
			border-radius: var(--theme-card-border-radius);
		}

		transition: transform 500ms ease;
	}

	@media (any-hover: hover) and (pointer: fine) {
		:global(.menuitem-card-container):hover {
			img {
				transform: scale(1.15);
			}

			.img {
				transform: scale(1.1);
			}
		}
	}
</style>
