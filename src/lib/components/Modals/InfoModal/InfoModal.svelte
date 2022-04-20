<svelte:options immutable />

<script lang="ts">
	import Card from 'svelty-material/components/Card/Card.svelte';

	import CloseBtn from '$lib/components/Buttons/CloseBtn.svelte';

	import { createEventDispatcher, onMount } from 'svelte';

	import { allergens } from '$lib/stores/allergens';

	import type { MenuItem } from 'types/product';
	import type { TranslationFunctions } from '$i18n/i18n-types';

	const dispatch = createEventDispatcher();

	onMount(() => {});

	export let menuitem: MenuItem;
	export let translations: TranslationFunctions['product'];

	let translateY: string | undefined = undefined;
</script>

<!-- draggable="true"
on:drag={e => console.debug(e)}
on:dragstart={e => console.debug(e)} -->

<!-- on:touchstart={e => console.debug(e)} -->

<div class="info-modal">
	<CloseBtn on:click={() => dispatch('close')} />
	<h1 class="heading">{menuitem.name}</h1>
	<p>{menuitem.desc}</p>

	{#if menuitem.allergens.length}
		<section>
			<h2 class="heading">{translations.allergens()}</h2>
			<ul>
				{#each menuitem.allergens as allergen}
					<li>
						<span class="allergen-key">{allergen}</span>
						{$allergens[allergen]}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style lang="scss">
	:global(.info-modal) {
		--close-btn-bg: var(--accent-color);

		width: 100%;
		min-width: 250px;
		padding: 1.5em 1.5em 1em;

		box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
			0 1px 5px 0 rgb(0 0 0 / 12%);

		border-radius: var(--theme-card-border-radius);
		background-color: var(--theme-cards);
		color: var(--theme-text-primary);
		display: block;
		max-width: 100%;
		outline: none;
		text-decoration: none;
		transition-property: box-shadow, opacity;
		overflow-wrap: break-word;
		position: relative;
		white-space: normal;

		@media screen and (max-width: 960px) {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		@media screen and (min-width: 961px) {
			max-width: 50ch;
		}

		// z-index: 1022;
	}

	.heading {
		margin-block-end: 0.3em;

		@at-root h1#{&} {
			font-size: 1.6rem;
			padding-inline-end: 38px;
		}

		@at-root h2#{&} {
			font-size: 1.3rem;
		}
	}

	section {
		margin-block-start: 0.7em;
	}

	ul {
		list-style: none;

		li:not(:last-child) {
			margin-block-end: 0.2em;
		}
	}

	.allergen-key {
		width: 1.35em;
		display: inline-flex;
		justify-content: space-between;
		margin-inline-end: 0.2em;

		&::after {
			content: '-';
		}
	}
</style>
