<script lang="ts">
	import Chip from 'svelty-material/components/Chip/Chip.svelte';

	export let ariaLabel: string;
</script>

<div itemscope itemprop="offers" itemtype="https://schema.org/Offer" class="price">
	<!-- <meta itemprop="priceCurrency" content="EUR" /> -->
	<Chip aria-label={ariaLabel} class="form-elements-color" style="font-size: .8em;">
		<slot />
	</Chip>
	<!-- <link itemprop="availability" href="https://schema.org/InStock" class="visually-hidden" />In Stock -->
</div>

<style lang="scss">
	.price {
		display: flex;
		position: absolute;
		justify-content: center;
		top: 0;
		font-size: 1.4rem;
		font-weight: 600;
		margin-inline-start: 0.4em;
	}
</style>
