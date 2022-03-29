<script lang="ts">
	export let src: Attributes<HTMLImageElement>['src'];
	export let alt: Attributes<HTMLImageElement>['alt'];
	export let width: Attributes<HTMLImageElement>['width'];
	export let height: Attributes<HTMLImageElement>['height'];

	let klass: Attributes<HTMLImageElement>['class'] = undefined;
	export { klass as class };
	export let loading: Attributes<HTMLImageElement>['loading'] = 'lazy';
	export let decoding: Attributes<HTMLImageElement>['decoding'] = 'async';
	export let style: Attributes<HTMLImageElement>['style'] = undefined;
	export let role: Attributes<HTMLImageElement>['role'] = undefined;
	export let ariaHidden: Attributes<HTMLImageElement>['aria-hidden'] = undefined;
</script>

<img
	{src}
	{alt}
	{role}
	{loading}
	{decoding}
	{width}
	{height}
	{style}
	class={klass}
	aria-hidden={ariaHidden}
/>

<!-- <style lang="scss">
	img {
		width: var(--img-width, auto);
		height: var(--img-height, auto);
	}
</style> -->

<style lang="scss">
	.img {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		box-sizing: border-box;
		padding: 0;
		border: none;
		margin: auto;

		display: block;
		width: 0;
		height: 0;
		min-width: 100%;
		max-width: 100%;
		min-height: 100%;
		max-height: 100%;

		object-fit: var(--image-blur-bg-size);
		object-position: var(--image-blur-bg-position);

		&-blur {
			filter: blur(20px);
			background-size: var(--image-blur-bg-size, cover);
			background-image: var(--image-blur-bg-image);
			background-position: var(--image-blur-bg-position, 0% 0%);
		}

		&-sizer-svg {
			display: block;
			max-width: 100%;
			width: initial;
			height: initial;
			background: none;
			opacity: 1;
			border: 0;
			margin: 0;
			padding: 0;
		}

		&-wrapper,
		&-sizer {
			display: block;
			width: initial;
			height: initial;
			background: none;
			opacity: 1;
			border: 0;
			margin: 0;
			padding: 0;
		}

		&-wrapper {
			overflow: hidden;

			&.fill {
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}

			&.responsive {
				display: block;
				position: relative;
			}

			&.intrinsic {
				display: inline-block;
				position: relative;
				max-width: 100%;
			}

			&.fixed {
				display: inline-block;
				position: relative;
				width: var(--image-width);
				height: var(--image-height);
			}
		}

		&-sizer {
			&.responsive {
				padding-top: (--image-paddin-top, 100%);
			}

			&.intrinsic {
				max-width: 100%;
			}
		}
	}
</style>
