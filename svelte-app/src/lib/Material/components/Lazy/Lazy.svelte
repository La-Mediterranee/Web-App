<script>
	import { createEventDispatcher } from "svelte";
	import Intersect from "../../actions/Intersect";

	export let observer: IntersectionObserverInit = {};
	let visible = false;
	const dispatch = createEventDispatcher();
	function intersect(e: CustomEvent<{ detail: IntersectionObserverEntry }>) {
		visible = true;
		dispatch("visible", e.detail);
	}
</script>

<div
	class="s-lazy"
	use:Intersect={{ once: true, ...observer }}
	on:intersect={intersect}
>
	{#if visible}
		<slot />
	{:else}
		<slot name="placeholder" />
	{/if}
</div>
