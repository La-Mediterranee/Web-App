<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Auth from '$lib/firebase/Auth.svelte';
	import Login from '$lib/components/Customer/Login';
</script>

<Auth>
	<div>
		<Login />
	</div>
</Auth>

<style>
	div {
		text-align: center;
		padding: 1.5em;
	}
</style>
