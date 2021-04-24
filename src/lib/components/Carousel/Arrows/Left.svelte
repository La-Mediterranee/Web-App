<script lang="ts">
	import { StateCallBack } from '../types';

	export let getState: () => StateCallBack;
	export let previous: () => void;
	export let disabled: boolean;
</script>

<slot name="customLeftArrow" {getState} {previous} {disabled}>
	<button
		aria-label="Go to previous slide"
		class="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
		onClick={() => previous()}
		type="button"
		{disabled}
	/>
</slot>
