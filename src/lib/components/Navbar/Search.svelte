<script lang="ts">
	import Icon from 'svelte-material-components/src/components/Icon/Icon.svelte';

	import { magnify } from '$lib/Icons';
</script>

<form role="search">
	<div>
		<input type="search" aria-label="essen oder getränke" size="20" />
		<button aria-label="suchen">
			<Icon path={magnify} style="color: #fff" />
		</button>
	</div>
</form>

<style lang="scss">
	@use "variables" as *;

	form {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		justify-self: flex-start;

		div {
			height: 2.5em;
			padding: 0.5em 0.7em;
			border-radius: 1.3em;
			width: 90%;
			// background: var(--bg-color);
			background: var(--tint-color);
			align-items: center;
		}

		@media screen and (min-width: map-get($map: $breakpoints, $key: md)) {
			width: 20%;
		}
	}

	input {
		display: flex;
		align-content: center;
		align-items: center;
		color: var(--text-color);
		height: 100%;
		width: calc(100% - 30px);
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 30px;
	}
</style>
