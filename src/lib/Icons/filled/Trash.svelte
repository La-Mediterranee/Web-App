<script lang="ts">
	export let height: number = 24;
	export let width: number = 24;
	export let color: string = 'currentColor';

	let _height = `${height}px`;
	let _width = `${width}px`;
</script>

<svg width={_width} height={_height} aria-hidden="true" viewBox="0 0 24 24">
	<path
		fill={color}
		d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
	/>
</svg>

<style>
</style>
