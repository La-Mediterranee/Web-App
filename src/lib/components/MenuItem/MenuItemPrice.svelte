<script lang="ts">
	export let ariaLabel: string;
</script>

<div itemscope itemprop="offers" itemtype="https://schema.org/Offer" class="content">
	<!-- <meta itemprop="priceCurrency" content="EUR" /> -->
	<span aria-label={ariaLabel} class="price">
		<slot />
	</span>
	<!-- <link itemprop="availability" href="https://schema.org/InStock" class="visually-hidden" />In Stock -->
</div>

<style lang="scss">
	span {
		display: flex;
		font-size: 1.4rem;
		padding: 0.3em 0;
		justify-content: center;
	}
</style>
