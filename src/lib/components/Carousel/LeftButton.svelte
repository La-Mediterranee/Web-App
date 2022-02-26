<script lang="ts">
	import NavButton from './NavButton.svelte';

	export let value: 'prev' | 'next';
	export let scroll: (e: Event) => void;
	export let setKeyboardFocus: (e: FocusEvent) => void;
</script>

<NavButton {value} {setKeyboardFocus} {scroll} side={'left'}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M19 12H6M12 5l-7 7 7 7" />
	</svg>
</NavButton>

<style lang="scss">
	svg {
		width: var(--carousel-left-arrow-size, 30px);
		height: var(--carousel-left-arrow-size, 30px);
		stroke: var(--carousel-left-arrow-color, #fff);
	}
</style>
