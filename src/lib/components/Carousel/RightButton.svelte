<script lang="ts">
	import NavButton from './NavButton.svelte';

	export let value: 'prev' | 'next';
	export let scroll: (e: Event) => void;
	export let setKeyboardFocus: (e: FocusEvent) => void;
</script>

<NavButton {value} {setKeyboardFocus} {scroll} side={'right'}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M5 12h13M12 5l7 7-7 7" />
	</svg>
</NavButton>

<style lang="scss">
	svg {
		width: var(--siema-right-arrow-size, 30px);
		height: var(--siema-right-arrow-size, 30px);
		stroke: var(--siema-right-arrow-color, #fff);
	}
</style>
