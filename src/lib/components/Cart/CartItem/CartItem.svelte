<slot />

<style lang="scss" global>
	#cart {
		.cart-item {
			color: var(--cart-table-color);
			padding: 0.3em;
			font-size: 1em;
			text-align: center;
		}

		@media screen and (min-width: 460px) {
			.cart-item {
				font-size: 1em;
				text-align: center;

				&:first-child {
					padding-inline-start: 0.5em;
				}

				&:last-child {
					padding-inline-end: 0.5em;
				}
			}
		}
	}
</style>
