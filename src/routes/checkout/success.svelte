<script>
	import { onMount } from 'svelte';
	let sessionId: string | null = null;
	onMount(() => {
		const url = typeof window !== 'undefined' ? window.location.href : '';
		sessionId = new URL(url).searchParams.get('session_id');
	});
</script>

<h3>Checkout was a Succcess! {sessionId}</h3>

<style>
	/* your styles go here */
</style>
