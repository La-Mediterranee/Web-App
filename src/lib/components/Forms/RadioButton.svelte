<svelte:options immutable />

<script lang="ts">
	import Ripple from './Ripple.svelte';

	export let value: string;

	export let group = '';
	export let checked = false;
	export let required = false;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let style: string | undefined = undefined;
</script>

<span {style} class="radio-container">
	<input bind:group type="radio" class="theme-radio" {id} {name} {value} {checked} {required} />
	<Ripple />
</span>

<style lang="scss" global>
	.radio-container {
		--_radio-size: var(--radio-size, 24px);

		position: relative;
		width: var(--_radio-size);
		height: var(--_radio-size);
		flex: 0 0 var(--_radio-size);
		border-radius: 48%;

		margin-inline-end: 0.42em;
	}

	.theme-radio {
		border: 4px solid;
		color: var(--radio-color, rgba(41, 34, 34, 0.4)); // rgba(41, 34, 34, 0.4);
		width: var(--_radio-size);
		height: var(--_radio-size);

		z-index: 1;
		position: relative;
		border-radius: 48%;
		cursor: pointer;
		outline: none;
		transition: all 0.3s ease-in-out;

		appearance: none;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;

		&:checked {
			border-color: var(--accent-color, orange);
			border-width: calc(var(--_radio-size) * 0.3); //0.5
			// background: var(--accent-color, orange);
		}

		&:hover + .ripple .ripple-element {
			opacity: var(--radio-hover-opacity, 0.08);
		}

		&:focus-visible + .ripple .ripple-element {
			opacity: var(--radio-focus-visible-opacity, 0.24);
		}
	}
</style>
