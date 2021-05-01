<script lang="ts">
	import { StateCallBack } from '../types';

	export let getState: () => StateCallBack;
	export let next: () => void;
	export let disabled: boolean;
</script>

<slot name="cutomRightArrow" {getState} {next} {disabled}>
	<button
		aria-label="Go to next slide"
		class="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
		type="button"
		on:click={() => next()}
		{disabled}
	/>
</slot>
