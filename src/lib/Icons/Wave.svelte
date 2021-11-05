<script lang="ts">
	export let style: string = '';
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" {style}>
	<defs>
		<linearGradient id="MyGradient">
			<stop offset="0%" stop-color="var(--top1)" />
			<stop offset="100%" stop-color="var(--top2)" />
		</linearGradient>
	</defs>
	<path
		fill="url(#MyGradient)"
		fill-opacity="1"
		d="M0,64L48,96C96,128,192,192,288,202.7C384,213,480,171,576,128C672,85,768,43,864,53.3C960,64,1056,128,1152,154.7C1248,181,1344,171,1392,165.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
	/>
</svg>

<style>
	svg {
		position: relative;
		top: -1px;
		display: block;
	}
</style>
