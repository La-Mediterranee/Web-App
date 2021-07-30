<script context="module">
	import uid from "../../internal/uid";
</script>

<script lang="ts">
	import TextColor from "../../internal/TextColor";
	import Ripple from "../../actions/Ripple";

	// Add class to radio wrapper.
	let klass = "";
	export { klass as class };

	// Color of the radio when active.
	export let color = "primary";

	// Disables the radio.
	export let disabled = false;

	// Bind radio to a group.
	export let group: number | string | string[] = 1;

	// Value for the radio.
	export let value: string | string | string[] | null = null;

	// Id for the checkbox.
	export let id: string | undefined = undefined;

	// Styles for the radio wrapper.
	export let style: string | undefined = undefined;

	// The <input/> element of the radio.
	export let inputElement: HTMLInputElement | undefined = undefined;

	id = id || `s-radio-${uid(5)}`;
	$: active = group === value;
</script>

<div class="s-radio" {style}>
	<div
		class="s-radio__wrapper {klass}"
		class:disabled
		use:TextColor={!disabled && active && color}
		use:Ripple={{ centered: true }}
	>
		<input
			type="radio"
			bind:this={inputElement}
			role="radio"
			aria-selected={active}
			bind:group
			{id}
			{value}
			{disabled}
		/>
		<div class="s-radio__background" />
	</div>
	<label for={id}>
		<slot />
	</label>
</div>

<style lang="scss" src="./Radio.scss" global>
</style>
