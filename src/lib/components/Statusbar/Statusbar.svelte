<script lang="ts">
	export let online = true;
</script>

<div role="status" aria-hidden={online} class:offline={online === false}>
	<em>
		<slot />
	</em>
</div>

<style>
	div {
		height: 2.5em;
		width: 100%;
		z-index: 10000;

		background-color: #007676;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translateY(-300%);
		transition: transform 0.5s ease-in-out;
		font-size: 1.3em;
		top: 0;
	}

	.offline {
		transform: translateY(0);
	}
</style>
