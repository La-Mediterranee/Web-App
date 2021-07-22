<script>
	export let item: Product;
	export let quantity: number;

	const { image, name, price, sku } = item;

	$: sum = price * quantity;
</script>

<div itemscope itemtype="https://schema.org/Product">
	<img itemprop="image" decoding="async" class="ml-auto" src={image?.src} alt={image?.alt} />
	<h4 itemprop="name" class="justify-center h4">{name}</h4>
	<span itemprop="priceCurrency" content="EUR">€</span>
	<span class="price" itemprop="price" content={`price`}>{sum}</span>
</div>

<style>
	/* your styles go here */
</style>
