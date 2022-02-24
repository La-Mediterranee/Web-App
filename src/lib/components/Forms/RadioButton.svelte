<svelte:options immutable />

<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string;
	export let checked = false;
	export let required = false;
</script>

<input type="radio" class="theme-radio" {id} {name} {value} {checked} {required} />

<style lang="scss" global>
	.theme-radio {
		--radio-size: 24px;

		color: rgba(41, 34, 34, 0.4);
		border: 4px solid;
		width: var(--radio-size);
		height: var(--radio-size);
		transition: all 0.2s ease-in-out;
		border-radius: 47%;
		position: relative;

		appearance: none;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;

		&:checked {
			border-color: var(--accent-color, orange);
			border-width: calc(var(--radio-size) * 0.32);
			// background: var(--accent-color, orange);
		}
	}
</style>
