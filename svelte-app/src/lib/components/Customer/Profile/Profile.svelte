<script lang="ts">
	import { signOut } from '@firebase/auth';
	import type { User, Auth } from 'firebase/auth';

	export let user: User | null = null;

	export let auth: Auth;
</script>

<div>
	<img src={user?.photoURL ?? ''} alt={`${user?.displayName ?? 'User'} Profilbild`} />

	<button on:click={() => signOut(auth)} />
</div>

<style>
	/* your styles go here */
</style>
