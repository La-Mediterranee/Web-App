<footer>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 500" fill="url(#MyGradient)">
		<defs>
			<linearGradient id="MyGradient">
				<stop offset="0" stop-color="var(--top1)" />
				<stop offset="100%" stop-color="var(--top2)" />
			</linearGradient>
		</defs>
		<path
			height="180"
			fill-opacity="1"
			d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,149.3C672,117,768,75,864,85.3C960,96,1056,160,1152,176C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
		/>
		<rect y="319" width="1440" height="100%" />
	</svg>
	<div class="content">
		<div>
			<h3>Über LA Mediterranee</h3>
			<ul>
				<li>Kontakt</li>
				<li>Über uns</li>
				<li>Impressum</li>
				<li>Geschäftsbedingungen</li>
			</ul>
		</div>
		<div>
			<h3>Lieferzeiten</h3>
			<ul>
				<li>Mo-Do: 20:00-02:00</li>
				<li>Fr und Sa: 20:00-04:00</li>
				<li>So: 20:00-02:00</li>
			</ul>
		</div>
	</div>
</footer>

<style lang="scss">
	@use "./variables.scss" as *;

	footer {
		position: relative;
		text-align: center;
		padding-top: clamp(10px, 6%, 40px);
		height: 100%;
	}

	svg {
		display: block;
		position: absolute;
		top: 0;

		path {
			stroke: none;
		}

		rect {
			stroke: none;
		}
	}

	ul {
		margin: 0.3em;
	}

	li {
		list-style: none;
	}

	.content {
		position: relative;
		z-index: 1;
		display: block;
		background: var(--theme-app-bar);
		margin-top: 13%;
		padding-bottom: 6em;

		// @media (min-width: 325px) {
		// 	margin-bottom: clamp(0px, 1%, 20px);
		// }

		@media screen and (min-width: $sm) {
			display: flex;
			justify-content: space-around;
		}
	}
</style>
