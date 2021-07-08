<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import Installprompt from '$lib/components/Installprompt';
	import MaterialApp from 'svelte-materialify/src/components/MaterialApp/MaterialAppMin.svelte';
	// import { FirebaseApp } from '$lib/Firebase';
	import FirebaseApp from '$lib/Firebase/Firebase.svelte';
	import Statusbar from '$lib/components/Statusbar';

	let online: boolean;
</script>

<svelte:window bind:online />

<FirebaseApp>
	<MaterialApp theme="custom">
		<Statusbar {online} />
		<Navbar />
		<main>
			<slot />
		</main>
		<Installprompt />
		<Footer />
	</MaterialApp>
</FirebaseApp>
