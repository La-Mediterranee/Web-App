<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
	import Footer from '$lib/Footer.svelte';
	import MaterialApp from 'svelte-materialify/src/components/MaterialApp/MaterialAppMin.svelte';
</script>

<MaterialApp theme="custom">
	<Navbar />
	<main>
		<slot />
	</main>
	<Footer />
</MaterialApp>
