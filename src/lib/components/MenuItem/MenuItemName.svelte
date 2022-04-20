<script lang="ts">
	export let href: string;
	export let tabindex: number | undefined = undefined;
	export let captureRipple: (node: HTMLAnchorElement, rippleNode?: HTMLElement) => void;
	export let captureRippleNode: HTMLElement | undefined = undefined;
	export let ariaHidden: boolean | undefined = undefined;
	export let style: string | undefined = undefined;
</script>

<div {style} class="title">
	<a
		{href}
		{tabindex}
		aria-hidden={ariaHidden}
		role="button"
		aria-haspopup="dialog"
		use:captureRipple={captureRippleNode}
		on:click|preventDefault
	>
		<h1 itemprop="name">
			<slot />
		</h1>
		<slot name="cta" />
	</a>
</div>

<style lang="scss">
	.title {
		display: flex;
		padding: 0 0.3em;
		height: 2.4em;
		font-size: 1.8rem;

		justify-content: center;
		align-items: center;
		text-align: center;

		a {
			text-align: inherit;
			text-decoration: none;
			outline: none;

			display: -webkit-box;
			word-break: break-word;
			text-overflow: ellipsis;
			hyphens: auto;

			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;

			&::after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 2;
			}
		}

		h1 {
			position: relative;
			z-index: 6;
			font-weight: bold;
			font-size: 1em;
		}
	}
</style>
