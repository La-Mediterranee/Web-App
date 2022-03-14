<svelte:options immutable />

<script lang="ts">
	import Ripple from 'svelty-material/actions/Ripple';

	export let value: string;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let group = '';
	export let checked = false;
	export let required = false;
</script>

<span use:Ripple class="radio-container">
	<input bind:group type="radio" class="theme-radio" {id} {name} {value} {checked} {required} />
</span>

<style lang="scss" global>
	.radio-container {
		--internal-radio-size: var(--radio-size, 24px);

		width: var(--internal-radio-size);
		height: var(--internal-radio-size);
		border-radius: 48%;
	}

	.theme-radio {
		color: var(--radio-color, rgba(41, 34, 34, 0.4)); // rgba(41, 34, 34, 0.4);
		border: 3px solid;
		width: var(--internal-radio-size);
		height: var(--internal-radio-size);
		transition: all 0.2s ease-in-out;
		border-radius: 48%;
		position: relative;

		appearance: none;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;

		&:checked {
			border-color: var(--accent-color, orange);
			border-width: calc(var(--internal-radio-size) * 0.3); //0.5
			// background: var(--accent-color, orange);
		}
	}
</style>
