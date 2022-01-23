<script lang="ts">
	let klass: string = '';
	export { klass as class };
	export let side: 'right' | 'left';
	export let value: 'prev' | 'next';
	export let scroll: (e: Event) => void;
	export let setKeyboardFocus: (e: FocusEvent) => void;
</script>

<button
	{value}
	type="button"
	class="carousel-nav-btn {klass}"
	class:left={side === 'left'}
	class:right={side === 'right'}
	on:focus={setKeyboardFocus}
	on:click={scroll}
>
	<slot />
</button>

<style lang="scss" global>
	.carousel-nav-btn {
		cursor: pointer;
		position: absolute;
		display: flex;

		top: 50%;
		z-index: 5;
		padding: 0.5rem;
		font-size: 2.5vw;
		border-radius: 0.4em;

		background: white;
		border: none;
		transition: transform 0.1s ease-in-out;
	}

	.left {
		left: 0;
		transform: translate(-150%, -50%);
		visibility: var(--has-items-left, all);
		margin-left: 0.2em;

		&:focus-visible,
		:global(.container):hover & {
			transform: translate(0%, -50%);
		}
	}

	.right {
		right: 0;
		transform: translate(150%, -50%);
		visibility: var(--has-items-right, all);
		margin-right: 0.2em;

		&:focus-visible,
		:global(.container):hover & {
			transform: translate(0%, -50%);
		}
	}
</style>
