<script lang="ts">
	export let href: string;
	export let tabindex: number | undefined = undefined;
	export let captureRipple: (node: HTMLAnchorElement, rippleNode?: HTMLElement) => void;
	export let captureRippleNode: HTMLElement | undefined = undefined;
	export let ariaHidden: boolean | undefined = undefined;
</script>

<div class="title">
	<a
		{href}
		{tabindex}
		aria-hidden={ariaHidden}
		role="button"
		aria-haspopup="dialog"
		use:captureRipple={captureRippleNode}
		on:click|preventDefault
	>
		<span itemprop="name">
			<slot />
		</span>
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

			word-break: break-word;
			display: -webkit-box;
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
	}
</style>
