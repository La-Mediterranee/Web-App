<!-- <svelte:options immutable /> -->
<script lang="ts">
	import Ripple from './Ripple.svelte';

	export let value: string;

	export let checked = false;
	export let required = false;
	export let name: string | undefined = undefined;
	export let id: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let group: Array<any> = [];

	type ChangeEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	function onChange(e: ChangeEvent) {
		const { value, checked } = e.currentTarget;
		checked ? group.push(value) : group.splice(group.indexOf(value), 1);
		group = group;
	}
</script>

<span class="checkbox-container" {style}>
	<input
		type="checkbox"
		class="theme-checkbox"
		{id}
		{name}
		{value}
		{checked}
		{required}
		on:change={onChange}
	/>
	<Ripple />
</span>

<style lang="scss" global>
	.checkbox-container {
		--_checkbox-size: var(--checkbox-size, 24px);

		position: relative;
		width: var(--_checkbox-size);
		height: var(--_checkbox-size);
		flex: 0 0 var(--_checkbox-size);
		border-radius: 38%;

		margin-inline-end: 0.42em;
	}

	.theme-checkbox {
		border: 4px solid;
		color: var(--checkbox-color, rgba(41, 34, 34, 0.4));
		width: var(--_checkbox-size);
		height: var(--_checkbox-size);

		z-index: 1;
		position: relative;
		border-radius: 38%;
		cursor: pointer;
		outline: none;
		transition: all 0.2s ease-in-out;

		appearance: none;
		-webkit-font-smoothing: inherit;
		-moz-osx-font-smoothing: inherit;

		&:checked {
			border-color: var(--accent-color, orange);
			border-width: calc(var(--_checkbox-size) * 0.5);
		}

		&:hover + .ripple .ripple-element {
			opacity: var(--checkbox-hover-opacity, 0.08);
		}

		&:focus-visible + .ripple .ripple-element {
			opacity: var(--checkbox-focus-visible-opacity, 0.24);
		}
	}
</style>
