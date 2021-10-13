<svelte:options immutable />

<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string;
	export let checked: boolean = false;
</script>

<input type="radio" class="theme-radio-btn" {id} {name} {value} {checked} />

<style lang="scss" global>
	.theme-radio-btn {
		color: rgba(41, 34, 34, 0.4);
		border: 3px solid;
		width: 18px;
		height: 18px;
		transition: all 0.2s ease-in-out;
		border-radius: 43%;

		appearance: none;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;

		&:checked {
			border-color: #fb8c00;
			border-width: 9px;
		}
	}
</style>
