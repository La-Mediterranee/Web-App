<script lang="ts">
	export let next: () => void;
	export let disabled: boolean;
</script>

<button
	aria-label="Go to next slide"
	class="multiple-carousel__arrow multiple-carousel__arrow--right"
	type="button"
	on:click={() => next()}
	{disabled}
/>
