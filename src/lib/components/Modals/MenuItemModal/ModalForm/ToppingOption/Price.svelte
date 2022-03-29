<script lang="ts">
	export let ariaLabel: string;
</script>

<span class="price" aria-label={ariaLabel}>
	<slot />
</span>

<style>
	.price {
		margin-inline-start: auto;
		margin-inline-end: 0.3em;
	}
</style>
