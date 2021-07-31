<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { afterUpdate } from 'svelte';
	import flash from '$lib/utils/flash';
	import {
		signIn,
		signInWithGoogle,
		signInWithFacebook,
		signInWithMicrosoft,
		signInWithTwitter,
		signInWithGithub,
		signInWithDiscord,
	} from '$utils/login';
	const minLength = 8;

	const passwordRules = [
		(v: string) => !!v || 'Required',
		(v: string) => v.length >= minLength || `Min ${minLength} characters`,
	];

	const emailRules = [
		(v: string) => !!v || 'Required',
		(v: string) => {
			const pattern =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return pattern.test(v) || 'Invalid e-mail.';
		},
	];

	function validateInput(email: string, password: string): boolean {
		for (const rule of emailRules) {
			if (rule(email) !== true) return false;
		}

		for (const rule of passwordRules) {
			if (rule(password) !== true) return false;
		}

		return true;
	}
</script>

<script lang="ts">
	import TextField from 'svelte-material-components/src/components/TextField';
	import { Account, Key, Eye, EyeOff } from '$lib/Icons/filled';

	import type { Auth, User } from 'firebase/auth';

	export let auth: Auth;

	let form: HTMLFormElement | null = null;
	let email: string = '';
	let password: string = '';
	let show: boolean = false;
	let error: unknown = null;

	// afterUpdate(() => {
	// 	flash(form as HTMLFormElement);
	// });

	async function login(e: MouseEvent | Event) {
		let user: User | undefined;

		try {
			const target = e.currentTarget as HTMLButtonElement;
			const value = target.value;

			switch (value) {
				case 'login':
					if (!validateInput(email, password)) {
						return;
					}
					user = await signIn(auth, email, password);
					break;
				case 'facebook':
					user = await signInWithFacebook(auth);
					break;
				case 'twitter':
					user = await signInWithTwitter(auth);
					break;
				case 'google':
					user = await signInWithGoogle(auth);
					break;
				case 'github':
					user = await signInWithGithub(auth);
					break;
				case 'discord':
					user = await signInWithDiscord(auth);
					break;
				case 'microsoft':
					const result = await signInWithMicrosoft(auth);
					user = result?.user;
					if (!auth.currentUser) {
						break;
					}
					//@ts-ignore
					auth.currentUser.photoURL = result?.imageUrl;
					break;
				default:
					break;
			}

			if (user) {
				const token = await user.getIdToken();
				await fetch(`/koa/auth/login?provider=firebase`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				error = false;
			} else {
				error = true;
			}
		} catch (err) {
			console.error(err);
			error = true;
		}
	}
</script>

{#if error}
	<div id="error">Es gab ein Fehler beim Einloggen</div>
{/if}

<h1>Login</h1>

<section id="emailPassword">
	<form
		bind:this={form}
		on:submit|preventDefault={login}
		name="login"
		novalidate
	>
		<div class="wrapper">
			<TextField
				bind:value={email}
				type="email"
				name="email"
				rules={emailRules}
				filled
				autocomplete="email"
				rounded
			>
				<div slot="prepend">
					<Account color="#fff" />
				</div>
				Email
			</TextField>
		</div>
		<div class="wrapper">
			<TextField
				bind:value={password}
				name="password"
				minlength={minLength}
				type={show ? 'text' : 'password'}
				rules={passwordRules}
				counter={`${minLength}+`}
				autocomplete="current-password"
				rounded
				filled
			>
				<div slot="prepend">
					<Key color="#fff" />
				</div>
				Passwort
				<div
					slot="append"
					on:click={() => {
						show = !show;
					}}
				>
					{#if show}
						<Eye style="cursor: pointer;" color="#fff" />
					{:else}
						<EyeOff style="cursor: pointer;" color="#fff" />
					{/if}
				</div>
			</TextField>
		</div>

		<button value="login">Einloggen</button>
	</form>

	<a id="register" href="/customer/register" role="button">Registrieren</a>
</section>

<section>
	<h2>Weiter Optionen:</h2>
	<noscript> Diese Optionen sind nur mit JS verfügbar </noscript>
	<button
		id="google"
		type="button"
		class="provider"
		on:click={login}
		value="google"
	>
		<!-- <img src="/google.svg" alt="Google Logo" /> -->
		<img src="/google.svg" alt="Google Logo" />
		<span class="buttonText"> Anmelden mit Google</span>
	</button>

	<button
		id="facebook"
		type="button"
		class="provider"
		on:click={login}
		value="facebook"
	>
		<img src="/facebook.svg" alt="Facebook Logo" />
		<span class="buttonText"> Anmelden mit Facebook</span>
	</button>

	<button
		id="microsoft"
		type="button"
		class="provider"
		on:click={login}
		value="microsoft"
	>
		<img src="/microsoft.svg" alt="Microsoft Logo" />
		<span class="buttonText"> Anmelden mit Microsoft</span>
	</button>

	<button
		id="twitter"
		type="button"
		class="provider"
		on:click={login}
		value="twitter"
	>
		<img src="/twitter.svg" alt="Facebook Logo" />
		<span class="buttonText"> Anmelden mit Twitter</span>
	</button>
</section>

<section>
	<h2>Für Devs:</h2>
	<button
		id="github"
		type="button"
		class="provider"
		on:click={login}
		value="github"
	>
		<img src="/github.svg" alt="Github Logo" />
		<span class="buttonText"> Anmelden mit Github</span>
	</button>
</section>

<section>
	<h2>Für Gamer:</h2>
	<button
		id="discord"
		type="button"
		class="provider"
		on:click={login}
		value="discord"
	>
		<img src="/discord.svg" alt="Discord Logo" />
		<span class="buttonText"> Anmelden mit Discord</span>
	</button>
</section>

<style lang="scss" src="./Login.scss"></style>
