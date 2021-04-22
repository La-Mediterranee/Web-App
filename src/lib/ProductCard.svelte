<script lang="ts">
	import Card from 'svelte-materialify/src/components/Card/Card.svelte';
	import CardActions from 'svelte-materialify/src/components/Card/CardActions.svelte';
	import CardTitle from 'svelte-materialify/src/components/Card/CardTitle.svelte';
	import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
	import Button from 'svelte-materialify/src/components/Button/Button.svelte';
	import Chip from 'svelte-materialify/src/components/Chip/Chip.svelte';
	import { mdiPlus, mdiMinus } from '@mdi/js';

	interface Image {
		src: string | undefined;
		alt: string | undefined;
	}

	export let image: Image;
	export let style: string;

	let amount = 1;

	function increment() {
		++amount;
	}

	function decrement() {
		--amount;
	}
</script>

<div class="card-container" {style}>
	<Card raised>
		<div class="inner-card">
			<img src="" alt="" dec />
			<!-- <img decoding="async" class="ml-auto" src={image?.src} alt={image?.alt} /> -->
			<CardTitle class="justify-center h4">Hamburger</CardTitle>

			<div class="actionsContainer">
				<svg
					class="wave"
					viewBox="0 0 400 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M0.222221 0C50.2222 0 50.0002 25 100 25C150 25 150.222 4.86802e-06 200.223 0C250.224 -4.86802e-06 249.999 25 300 25C350.001 25 350.222 1.52588e-05 400.223 0C450.224 -1.52588e-05 400.223 250 400.223 250H0.222221C0.222221 250 -49.7778 0 0.222221 0Z"
						fill="#278CC5"
					/>
				</svg>

				<CardActions>
					<Button
						disabled={amount === 1 ? true : false}
						text
						fab
						size="small"
						class="orange darken-1"
						on:click={decrement}
					>
						<Icon path={mdiMinus} />
					</Button>
					<Chip class="w-100 m-2 justify-center">
						{amount}
					</Chip>
					<Button
						text
						fab
						size="small"
						class="ml-auto orange darken-1"
						on:click={increment}
					>
						<Icon path={mdiPlus} />
					</Button>
				</CardActions>
			</div>
		</div>
	</Card>
</div>

<style lang="scss">
	img {
		width: 100%;
		transition: transform 500ms ease;
	}

	div {
		position: relative;
	}

	.actionsContainer {
		width: 100%;
		padding-top: 1.25em;
		position: relative;
		overflow: hidden;
	}

	.wave {
		position: absolute;
		top: 0px;
		left: 0;
		width: 200%;
		animation: wave linear 3s infinite;
		@media (prefers-reduced-motion) {
			animation-play-state: paused;
		}
	}

	.card-container {
		flex: 0 0 auto;

		:global(.s-card-title) {
			padding: 0 16px;
		}
	}

	@media (pointer: fine) {
		img {
			margin-bottom: 10px;
		}

		.inner-card {
			overflow: hidden;
		}

		.card-container {
			:global(.s-card-title) {
				padding: 16px;
			}

			&:hover {
				img {
					transform: scale(1.1);
				}
				.actionsContainer {
					opacity: 1;
					transform: translateY(-100%);
				}
				.wave {
					animation-play-state: running;
					@media (prefers-reduced-motion) {
						animation-play-state: paused;
					}
				}
			}
		}

		.wave {
			position: absolute;
			top: 0;
			left: 0;
			width: 200%;
			animation: wave linear 3s infinite;
			animation-play-state: paused;
		}

		.actionsContainer {
			position: absolute;
			transition: transform 750ms ease;
		}
	}

	@keyframes wave {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(-50%);
		}
	}
</style>
