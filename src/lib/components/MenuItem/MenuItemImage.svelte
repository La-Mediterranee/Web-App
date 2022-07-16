<script lang="ts">
	import Image from '$lib/components/Image/Image.next.svelte';
	import type { MenuItem } from 'types/product';

	type CrossOrigin = 'anonymous' | 'use-credentials' | '';

	export let image: MenuItem['image'];
	export let crossorigin: CrossOrigin | undefined = undefined;
</script>

<div class="img">
	<Image
		itemprop="image"
		src={image.src}
		alt={image.alt}
		width={image.width || 640}
		height={image.height || 480}
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
		// overflow: hidden;

		border-radius: var(--theme-card-border-radius);
		margin: 0 auto;
		margin-block-start: var(--menu-item-img-mbs, 0.6em);
		margin-block-end: 0.6em;
		// padding: 0.5em 0;

		transition: transform 500ms ease;

		> :global(span) {
			transition: transform 500ms ease;
		}

		&::after {
			content: '';
			// background-color: aliceblue;
			position: absolute;
			top: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
		}
	}

	@media (any-hover: hover) and (pointer: fine) {
		:global(.menuitem-card-container):hover {
			img {
				transform: scale(1.15);
			}

			.img > :global(span) {
				transform: scale(1.1);
			}
		}
	}
</style>
