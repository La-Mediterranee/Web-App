<script>
	// Props
	export let items = [...Array(10).keys()];
	export let scrollBy = 4;

	const paginationFactor = 175;
	const totalPaginationPixels = scrollBy * paginationFactor;

	$: offset = 0;
	$: atStart = offset === 0;
	$: atEnd = offset <= paginationFactor * (items.length - scrollBy) * -1;

	const move = (direction) => {
		if (direction > 0 && !atEnd) {
			offset -= totalPaginationPixels;
		} else if (direction < 0 && !atStart) {
			offset += totalPaginationPixels;
		}
	};
</script>

<main>
	<div class="items" style="transform: translateX({offset}px);">
		{#each items as item, i}
			<div class="item" style="background-color: hsla({i * 25}deg, 75%, 55%);">{item}</div>
		{/each}
	</div>
</main>

<button disabled={atStart} on:click={() => move(-1)}>&lsaquo; Prev</button>
<button disabled={atEnd} on:click={() => move(1)}>Next &rsaquo;</button>

<div class="details">
	offset: {offset}px<br />
	atStart: {atStart}<br />
	atEnd: {atEnd}
</div>

<style>
	main {
		width: 700px;
		overflow: hidden;
	}

	.items {
		display: flex;
		transition: transform 0.4s ease-in-out;
		transform: translateX(0px);
	}

	.item {
		min-width: 167px;
		height: 100px;
		margin: 0 4px;
		background-color: #ef4322;
		border-radius: 0.7rem;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		font-size: 10rem;
		user-select: none;
		overflow: hidden;
	}

	.items .item:first-child {
		margin-left: 0;
	}

	.items .item:last-child {
		margin-right: 0;
	}

	.details {
		margin-top: 20px;
		font-style: italic;
		color: #9f9f9f;
	}
</style>
