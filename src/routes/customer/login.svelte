<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Login from '$lib/components/Customer/Login';
	import { getAuthContext } from '$lib/firebase/helpers';

	const user = getAuthContext();
</script>

<div>
	<Login auth={user.auth} />
</div>

<style>
	div {
		text-align: center;
		padding: 1.5em;
	}
</style>
