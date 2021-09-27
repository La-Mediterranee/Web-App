<script lang="ts">
	import { goto } from '$app/navigation';

	import Button from 'svelte-material-components/src/components/Button/Button.svelte';

	import type { AuthStore } from '$lib/firebase/auth';

	export let user: AuthStore;
</script>

<div>
	<h1>Profil</h1>

	<section>
		<img
			src={`${$user?.photoURL || ''}`}
			alt={`${$user?.displayName || 'Users'} Profilbild`}
		/>

		<h3>{$user?.displayName}</h3>
	</section>

	<section>
		<h2>Einstellungen</h2>

		<section>
			<h3>Zahlunungmethoden</h3>
		</section>
	</section>

	<Button
		type="button"
		size="x-large"
		class="orange darken-1"
		rounded
		on:click={async () => {
			await user.logOut();
			goto('/customer/login');
		}}
	>
		Abmelden
	</Button>
</div>

<style>
	img {
		width: 7em;
		height: 7em;
	}

	div {
		text-align: center;
	}

	section {
		margin-bottom: 0.75rem;
	}
</style>
