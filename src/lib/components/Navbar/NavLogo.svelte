<script lang="ts">
	export let href: string;
</script>

<div id="nav-logo">
	<a {href} on:click>
		<img src="/Logos/V1_210.webp" aria-hidden="true" alt="" />
		<span class="visually-hidden">
			<slot />
		</span>
	</a>
</div>

<style lang="scss">
	#nav-logo {
		display: flex;
		width: 6.7em;
		height: 3.8em;

		img {
			width: 6.7em;
			height: 100%;
		}
	}
</style>
