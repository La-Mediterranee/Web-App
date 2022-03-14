<script></script>

<footer id="page-footer" itemscope itemtype="https://schema.org/WPFooter">
	<svg
		id="footer-wave"
		aria-hidden="true"
		width="1440"
		height="237"
		viewBox="0 0 1440 237"
		fill="url(#MyGradient)"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="none"
	>
		<defs>
			<linearGradient id="MyGradient">
				<stop offset="0" stop-color="var(--top1)" />
				<stop offset="100%" stop-color="var(--top2)" />
			</linearGradient>
		</defs>
		<path
			fill-opacity="1"
			d="M0 44.2864L48 60.2864C96 76.2864 192 108.286 288 113.586C384 119.286 480 97.2864 576 65.5864C672 33.2864 768 -8.71355 864 1.58645C960 12.2865 1056 76.2864 1152 92.2864C1248 108.286 1344 76.2864 1392 60.2864L1440 44.2864V236.286H1392C1344 236.286 1248 236.286 1152 236.286C1056 236.286 960 236.286 864 236.286C768 236.286 672 236.286 576 236.286C480 236.286 384 236.286 288 236.286C192 236.286 96 236.286 48 236.286H0V44.2864Z"
		/>
	</svg>

	<div class="content">
		<div>
			<h3 id="footer-about">Über LA Mediterranee</h3>
			<ul aria-labelledby="footer-about">
				<li><a href="/"> Kontakt </a></li>
				<li><a href="/ueber-uns"> Über uns </a></li>
				<li><a href="/impressum">Impressum</a></li>
				<li><a href="/">Geschäftsbedingungen</a></li>
			</ul>
		</div>
		<div>
			<h3 id="footer-deliverytimes">Lieferzeiten</h3>
			<ul aria-labelledby="footer-deliverytimes">
				<li>Mo-Do: 20:00-02:00</li>
				<li>Fr und Sa: 20:00-04:00</li>
				<li>So: 20:00-02:00</li>
			</ul>
		</div>
	</div>
	<a href="#top-of-site" class="top-of-site-link" data-visible="true" hidden>
		<span class="visually-hidden">Back to Top</span>
		<svg width="32" height="32" viewBox="0 0 100 100" aria-hidden="true">
			<path
				fill="white"
				d="m50 0c-13.262 0-25.98 5.2695-35.355 14.645s-14.645 22.094-14.645 35.355 5.2695 25.98 14.645 35.355 22.094 14.645 35.355 14.645 25.98-5.2695 35.355-14.645 14.645-22.094 14.645-35.355-5.2695-25.98-14.645-35.355-22.094-14.645-35.355-14.645zm20.832 62.5-20.832-22.457-20.625 22.457c-1.207 0.74219-2.7656 0.57812-3.7891-0.39844-1.0273-0.98047-1.2695-2.5273-0.58594-3.7695l22.918-25c0.60156-0.61328 1.4297-0.96094 2.2891-0.96094 0.86328 0 1.6914 0.34766 2.293 0.96094l22.918 25c0.88672 1.2891 0.6875 3.0352-0.47266 4.0898-1.1562 1.0508-2.9141 1.0859-4.1133 0.078125z"
			/>
		</svg>
	</a>
</footer>

<style lang="scss" global>
	@use 'variables' as *;

	#page-footer {
		display: flex;
		position: relative;
		text-align: center;

		width: 100%;
		height: 100%;
		margin-top: 5.3em;

		#footer-wave {
			display: block;
			position: absolute;
			top: 0;
			height: 130px;
			width: 100%;
			transform: translateY(-5em);

			// transform: translateY(-4em);

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
			padding-bottom: var(--tab-bar-active-height);

			width: 100%;

			// @media (min-width: 325px) {
			// 	margin-bottom: clamp(0px, 1%, 20px);
			// }

			@media screen and (min-width: map-get($map: $breakpoints, $key: sm)) {
				display: flex;
				justify-content: space-around;
			}
		}
	}
</style>
