<script></script>

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
			<h3 id="footer-about">Über LA Mediterranee</h3>
			<ul role="group" aria-labelledby="footer-about">
				<li><a href="/"> Kontakt </a></li>
				<li><a href="/ueber-uns"> Über uns </a></li>
				<li><a href="/impressum">Impressum</a></li>
				<li><a href="/">Geschäftsbedingungen</a></li>
			</ul>
		</div>
		<div>
			<h3 id="footer-deliverytimes">Lieferzeiten</h3>
			<ul role="group" aria-labelledby="footer-deliverytimes">
				<li>Mo-Do: 20:00-02:00</li>
				<li>Fr und Sa: 20:00-04:00</li>
				<li>So: 20:00-02:00</li>
			</ul>
		</div>
	</div>
	<a href="#top-of-site" class="top-of-site-link" data-visible="true">
		<span class="screen-reader-text">Back to Top</span>
		<svg width="32" height="32" viewBox="0 0 100 100">
			<path
				fill="white"
				d="m50 0c-13.262 0-25.98 5.2695-35.355 14.645s-14.645 22.094-14.645 35.355 5.2695 25.98 14.645 35.355 22.094 14.645 35.355 14.645 25.98-5.2695 35.355-14.645 14.645-22.094 14.645-35.355-5.2695-25.98-14.645-35.355-22.094-14.645-35.355-14.645zm20.832 62.5-20.832-22.457-20.625 22.457c-1.207 0.74219-2.7656 0.57812-3.7891-0.39844-1.0273-0.98047-1.2695-2.5273-0.58594-3.7695l22.918-25c0.60156-0.61328 1.4297-0.96094 2.2891-0.96094 0.86328 0 1.6914 0.34766 2.293 0.96094l22.918 25c0.88672 1.2891 0.6875 3.0352-0.47266 4.0898-1.1562 1.0508-2.9141 1.0859-4.1133 0.078125z"
			/>
		</svg>
	</a>
</footer>

<style lang="scss">
	@use 'variables' as *;

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

		@media screen and (min-width: map-get($map: $breakpoints, $key: sm)) {
			display: flex;
			justify-content: space-around;
		}
	}
</style>
