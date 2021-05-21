<script lang="ts">
	import { SkipCallbackOptions } from '../types';

	export let index: number;
	export let isActive: boolean;
	export let goToSlide: (index: number, skipCallbacks?: SkipCallbackOptions) => void;
	export let nextSlide: number;
</script>

<!-- class={`multi-carousel-dot ${isActive ? 'multi-carousel-dot--active' : ''}`}
 -->

<li class="multi-carousel-dot" class:multi-carousel-dot--active={isActive === true}>
	<button aria-label={`Go to slide ${index + 1}`} on:click={() => goToSlide(nextSlide)} />
</li>
