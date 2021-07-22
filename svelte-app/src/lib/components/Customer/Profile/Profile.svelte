<script lang="ts">
	import { getFirebaseContext } from '$lib/firebase/helpers';

	import { signOut } from '@firebase/auth';
	import type { User, Auth } from 'firebase/auth';
	import { getContext } from 'svelte';

	export let user: User | null = null;

	export let auth: Auth = getContext('customer');
	console.log(auth);
</script>

<div>
	<img src={user?.photoURL ?? ''} alt={`${user?.displayName ?? 'User'} Profilbild`} />

	<button on:click={() => signOut(auth)} />
</div>

<style>
	/* your styles go here */
</style>
