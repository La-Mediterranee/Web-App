<script lang="ts">
	import Chip from 'svelty-material/components/Chip/Chip.svelte';

	export let ariaLabel: string;
</script>

<div itemscope itemprop="offers" itemtype="https://schema.org/Offer" class="price bottom-right">
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
		font-size: 1.4rem;
		font-weight: 600;
	}

	.top-left {
		top: 0;
		padding-block-start: 0.2em;
		margin-inline-start: 0.4em;
	}

	.bottom-right {
		bottom: calc(var(--_menuitem-name-height) + 0.7em);
		right: 0;
		padding-block-end: 0.2em;
		margin-inline-end: 0.4em;
	}
</style>
