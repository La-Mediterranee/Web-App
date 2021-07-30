<script lang="ts">
	import Style from '../../internal/Style';

	interface Dataset {
		name: string;
		value: any;
	}

	let klass = '';
	export { klass as class };
	export let size = 24;
	export let width: number = size;
	export let height: number = size;
	export let viewWidth = '24';
	export let viewHeight = '24';
	export let rotate = 0;
	export let spin = false;
	export let disabled = false;
	export let path: string | null = null;
	export let label: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let ariaHidden = false;
	export let focusable = false;
	export let dataset: Dataset[] = [];

	let _dataset: string[];
	$: _dataset = dataset.map(({ name, value }) => {
		return `data-${name}=${value}`;
	});

	let _height: string; //= `${height}px`;
	let _width: string; //= `${width}px`;

	$: {
		width = size;
		height = size;
	}

	$: {
		_width = `${height}px`;
		_height = `${width}px`;
	}
</script>

<i
	aria-hidden="true"
	class="s-icon {klass}"
	class:spin
	aria-label={label}
	class:disabled
	use:Style={{ 'icon-size': size, 'icon-rotate': `${rotate}deg` }}
	aria-disabled={disabled}
	{..._dataset}
	{style}
>
	{#if path}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={_width}
			height={_height}
			aria-hidden={`${ariaHidden}`}
			focusable={`${focusable}`}
			viewBox="0 0 {viewWidth} {viewHeight}"
		>
			<path d={path}>
				{#if label}
					<title>{label}</title>
				{/if}
			</path>
		</svg>
	{/if}
	<slot />
</i>

<style lang="scss" global>
	@use "./Icon.scss" as *;
</style>
