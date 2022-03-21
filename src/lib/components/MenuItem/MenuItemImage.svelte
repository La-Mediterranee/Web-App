<script lang="ts">
	export let src: string;
	export let alt: string;
	export let width: number = 219;
	export let height: number = 150;
</script>

<img itemprop="image" decoding="async" loading="lazy" {src} {alt} {width} {height} />

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

	:global(.menuitem-card-container):hover {
		img {
			transform: scale(1.15);
		}
	}
</style>
