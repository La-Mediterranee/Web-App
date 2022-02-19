<svelte:options immutable />

<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string;
	export let checked = false;
	export let required = false;
</script>

<input type="checkbox" class="theme-radio-btn" {id} {name} {value} {checked} {required} />

<style lang="scss" global>
	.theme-radio-btn {
		color: rgba(41, 34, 34, 0.4);
		border: 3px solid;
		width: 20px;
		height: 20px;
		transition: all 0.2s ease-in-out;
		border-radius: 41%;

		appearance: none;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;

		&:checked {
			border-color: var(--accent-color, orange);
			border-width: 9px;
		}
	}
</style>
