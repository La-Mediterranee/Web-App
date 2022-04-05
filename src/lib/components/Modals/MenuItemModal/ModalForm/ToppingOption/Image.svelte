<script lang="ts">
	import Image from '$lib/components/Image/Image.next.svelte';

	export let src: string;
	export let alt: string;
</script>

<div>
	<Image
		{src}
		{alt}
		class="topping-item-img"
		width={70}
		height={48}
		role="presentation"
		layout="responsive"
		objectFit="scale-down"
		objectPosition="center"
	/>
</div>

<style lang="scss">
	div {
		flex: 0 0 50px;
	}

	// :global(.topping-item-img) {
	// 	margin: 0 1em;
	// }
</style>
