<script lang="ts">
	export let height: number = 24;
	export let width: number = 24;
	export let color: string = 'currentColor';

	let _height = `${height}px`;
	let _width = `${width}px`;
</script>

<svg width={_width} height={_height} viewBox="0 0 24 24">
	<path
		fill={color}
		d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
	/>
</svg>
