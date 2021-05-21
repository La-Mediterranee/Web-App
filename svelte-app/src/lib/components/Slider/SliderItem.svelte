<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	export let active = false;
	export let classes = '';
	export let style = '';
	export let allow_dynamic_height = false;
	let swipeItemInner = null;
	let _height = 0;

	const dispatch = createEventDispatcher();

	function firehHeightChange() {
		if (swipeItemInner) {
			let { scrollHeight, clientHeight } = swipeItemInner;
			dispatch('swipe_item_height_change', { height: Math.max(scrollHeight, clientHeight) });
		}
	}

	$: allow_dynamic_height && active && _height && requestAnimationFrame(firehHeightChange);

	onMount(() => {
		setTimeout(() => {
			allow_dynamic_height && requestAnimationFrame(firehHeightChange);
		}, 100);
	});
</script>

<div bind:clientHeight={_height} class="slider-item {classes} {active ? 'is-active' : ''} " {style}>
	<div bind:this={swipeItemInner} class="swipeable-item-inner">
		<slot />
	</div>
</div>

<style>
	.slider-item {
		width: 100%;
		z-index: 1;
		display: inline-block;
		position: relative;
		white-space: normal;
		vertical-align: top;
		padding: 0 2px;
	}
</style>
