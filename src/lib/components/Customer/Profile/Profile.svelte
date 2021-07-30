<script lang="ts">
	import { goto } from '$app/navigation';
	import { derived } from 'svelte/store';

	import Button from '$material/components/Button/Button.svelte';

	import type { User } from '@firebase/auth';
	import type { FirebaseUser } from 'types/firebase';

	export let user: FirebaseUser;

	export const profile = derived(user, ($user) => $user as User);
</script>

<div>
	<div>
		<img
			src={`${$profile?.photoURL || ''}`}
			alt={`${$profile?.displayName || 'User'} Profilbild`}
		/>

		<h3>{$profile?.displayName}</h3>
	</div>

	<section>
		<h3>Einstellungen</h3>
	</section>

	<Button
		type="button"
		size="x-large"
		class="orange darken-1"
		rounded
		on:click={() => {
			user.logOut();
			goto('customer/login');
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
</style>
