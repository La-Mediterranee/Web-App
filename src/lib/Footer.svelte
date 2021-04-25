<footer>

	<div class="content">
		<div>
			<h3>Über uns</h3>
		</div>
		<div>
			<h3>Lieferzeiten</h3>
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		position: relative;
		text-align: center;
		// padding-top: 100px;
		background-image: url(./Footer.svg);
	}

	svg {
		display: block;
		position: absolute;
		top: 0px;
		z-index: 1;

		path{
			stroke: none;
		}

		rect{
			stroke: none;
		}
	}

	.content {
		padding: 20px;
		// padding-top: 100px;
		position: relative;
		// background: linear-gradient(to right, var(--top1), var(--top2));
		z-index: 5;
	}
</style>
