<script lang="ts">
	export let previous: () => void;
	export let disabled: boolean;
</script>

<button
	aria-label="Go to previous slide"
	class="multiple-carousel__arrow multiple-carousel__arrow--left"
	onClick={() => previous()}
	type="button"
	{disabled}
/>
