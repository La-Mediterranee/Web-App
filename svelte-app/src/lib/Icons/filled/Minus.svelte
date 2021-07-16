<script lang="ts">
	export let height: number = 24;
	export let width: number = 24;
	export let color: string = 'currentColor';

	let _height = `${height}px`;
	let _width = `${width}px`;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={_width} height={_height} viewBox="0 0 24 24">
	<path fill={color} d="M19,13H5V11H19V13Z" />
</svg>
