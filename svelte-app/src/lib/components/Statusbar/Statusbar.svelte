<script lang="ts">
	export let online = true;
</script>

<div class:offline={online === false}>
	<em>Sie sind derzeit offline</em>
</div>

<style>
	div {
		height: 2.5em;
		width: 100%;
		z-index: 100;
		background-color: darkcyan;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translateY(-100%);
		transition: transform 0.5s ease-in-out;
	}

	.offline {
		transform: translateY(0);
	}
</style>
