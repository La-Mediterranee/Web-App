<svelte:options immutable />

<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string;
	export let checked = false;
	export let required = false;
</script>

<input type="checkbox" class="theme-checkbox" {id} {name} {value} {checked} {required} />

<style lang="scss" global>
	.theme-checkbox {
		--checkbox-size: 24px;

		color: rgba(41, 34, 34, 0.4);
		border: 4px solid;
		width: var(--checkbox-size);
		height: var(--checkbox-size);
		transition: all 0.2s ease-in-out;
		border-radius: 38%;

		appearance: none;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;

		&:checked {
			border-color: var(--accent-color, orange);
			border-width: calc(var(--checkbox-size) * 0.5);
		}
	}
</style>
