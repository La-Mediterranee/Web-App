<script lang="ts">
	const amount = 5;

	let n = 0;
	export let categories: any = [
		'burger',
		'sandwiches',
		'fish',
		'burger',
		'sandwiches',
		'fish',
		'burger',
		'sandwiches',
		'fish',
		'burger',
		'sandwiches',
		'fish',
	];
</script>

<ul class="hexagon-grid">
	{#each categories as category, i}
		<li
			class="hexagon"
			style="animation-delay: {(i + 4) % 4 === 0 ? 0.1 : i * 0.06}s;"
		>
			<div class="hexagon-inner">
				<a href="/food/{category}">
					<!-- <img
						src="https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg"
						alt=""
					/> -->
					<h1>
						{category}
					</h1>
				</a>
			</div>
		</li>
	{/each}
</ul>

<style lang="scss">
	@use "variables" as *;

	li {
		list-style: none;
		text-align: center;

		// &:nth-child(odd) {
		// 	background: green;
		// }
	}

	a {
		display: block;
		width: 100%;
		height: 100%;
		text-align: center;
		overflow: hidden;
		transform: skewY(-30deg) rotate3d(0, 0, 1, 60deg);
		background-color: var(--body-bg2);
	}

	.hexagon-grid {
		width: 80%;
		display: flex;
		flex-wrap: wrap;
		font-size: 1em; /* disable white space between inline block element */
		padding-bottom: 7.4%;
		margin: 0 auto;
		overflow: hidden;
		list-style-type: none;
	}

	.hexagon {
		position: relative;
		visibility: hidden;
		outline: 1px solid transparent; /* fix for jagged edges in FF on hover transition */
		opacity: 0;
		animation-timing-function: ease-in;
		animation-name: fade-in;
		animation-fill-mode: forwards;

		&::after {
			content: '';
			display: block;
			padding-bottom: 86.602%; /* =  100 / tan(60) * 1.5 */
		}

		h1,
		p {
			width: 100%;
			padding: 5%;
			box-sizing: border-box;
			// transition: transform 0.2s ease-out, opacity 0.3s ease-out;
		}

		h1 {
			display: flex;
			justify-content: center;
			align-items: center;
			bottom: 0;
			font-size: 1.5em;
			width: 100%;
			height: 100%;
		}

		&:hover h1,
		&:focus h1,
		&:hover p,
		&:focus p {
			transform: translate3d(0, 0, 0);
		}

		&-inner {
			position: absolute;
			width: 96%;
			padding-bottom: 110.851%; /* =  width / sin(60) */
			margin: 0 2%;
			overflow: hidden;
			visibility: hidden;
			outline: 1px solid transparent; /* fix for jagged edges in FF on hover transition */
			transform: rotate3d(0, 0, 1, -60deg) skewY(30deg);
		}

		* {
			position: absolute;
			visibility: visible;
			outline: 1px solid transparent;
			opacity: 1;
			transition: opacity ease-in 0.4s;
		}

		img {
			left: -100%;
			right: -100%;
			height: 100%;
			width: auto;
			margin: 0 auto;
		}

		p {
			top: 50%;
			padding-bottom: 50%;
			transform: translate3d(0, 100%, 0);
		}
	}

	/*** HEXAGON SIZING AND EVEN ROW INDENTATION *****************************************************************/
	@media screen and (min-width: 1201px) {
		/* <- 5-4  hexagons per row */
		.hexagon-grid {
			padding-bottom: 4.4%;
		}

		.hexagon {
			width: 20%; /* = 100 / 5 */

			&:nth-child(9n + 6) {
				margin-left: 10%; /* = width of .hex / 2  to indent even rows */
			}
		}
	}

	@media screen and (min-width: 901px) and (max-width: 1200px) {
		/* <- 4-3  hexagons per row */
		.hexagon-grid {
			padding-bottom: 5.5%;
		}

		.hexagon {
			width: 25%; /* = 100 / 4 */

			&:nth-child(7n + 5) {
				margin-left: 12.5%; /* = width of .hex / 2  to indent even rows */
			}
		}
	}

	@media screen and (min-width: 601px) and (max-width: 900px) {
		/* <- 3-2  hexagons per row */
		.hexagon-grid {
			padding-bottom: 7.4%;
		}

		.hexagon {
			width: 33.333%; /* = 100 / 3 */

			&:nth-child(5n + 4) {
				/* first hexagon of even rows */
				margin-left: 16.666%; /* = width of .hex / 2  to indent even rows */
			}
		}
	}

	@media screen and (max-width: 600px) {
		/* <- 2-1  hexagons per row */
		.hexagon-grid {
			padding-bottom: 11.2%;
		}

		.hexagon {
			width: 50%; /* = 100 / 3 */

			&:nth-child(3n + 3) {
				/* first hexagon of even rows */
				margin-left: 25%; /* = width of .hex / 2  to indent even rows */
			}
		}
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
