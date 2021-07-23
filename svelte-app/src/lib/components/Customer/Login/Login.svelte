<script lang="ts">
	import { goto } from '$app/navigation';

	import {
		signIn,
		signInWithGoogle,
		signInWithFacebook,
		signInWithMicrosoft,
		signInWithTwitter
	} from '$utils/login';
	import { Account, Key, Eye, EyeOff } from '$lib/Icons/filled';
	import TextField from 'svelte-materialify/src/components/TextField/TextField.svelte';

	import type { Auth, User } from 'firebase/auth';

	const minLength = 8;

	const passwordRules = [
		(v: string) => !!v || 'Required',
		(v: string) => v.length >= minLength || `Min ${minLength} characters`
	];

	const emailRules = [
		(v: string) => !!v || 'Required',
		(v: string) => {
			const pattern =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return pattern.test(v) || 'Invalid e-mail.';
		}
	];

	export let auth: Auth;
	let email: string = '';
	let password: string = '';
	let show: boolean = false;
	let error: unknown = null;
	let form: HTMLFormElement | null = null;

	async function login(e: MouseEvent) {
		let user: User | undefined;

		try {
			const target = e.currentTarget as HTMLButtonElement;
			const value = target.value;

			switch (value) {
				case 'login':
					if (!validateInput()) {
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
				case 'microsoft':
					user = await signInWithMicrosoft(auth);
					break;
				default:
					break;
			}

			if (auth != null) {
				if (user) {
					goto('/customer');
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	function validateInput(): boolean {
		for (const rule of emailRules) {
			if (rule(email) !== true) return false;
		}

		for (const rule of passwordRules) {
			if (rule(password) !== true) return false;
		}

		return true;
	}
</script>

{#if error}
	<div id="error">Es gab ein Fehler beim einloggen</div>
{/if}

<h1>Login</h1>

<section>
	<form bind:this={form} name="login" novalidate>
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

		<button on:click|preventDefault={login} value="login">Einloggen</button>
	</form>

	<a id="register" href="/customer/register" role="button">Registrieren</a>
</section>

<section>
	<h2>Weiter Optionen:</h2>
	<button id="google" type="button" class="provider" on:click={login} value="google">
		<!-- <img src="/google.svg" alt="Google Logo" /> -->
		<img src="/google.svg" alt="Google Logo" />
		<span class="buttonText"> Anmelden mit Google</span>
	</button>

	<button id="facebook" type="button" class="provider" on:click={login} value="facebook">
		<img src="/facebook.svg" alt="Facebook Logo" />
		<span class="buttonText"> Anmelden mit Facebook</span>
	</button>

	<button id="microsoft" type="button" class="provider" on:click={login} value="microsoft">
		<img src="/microsoft.svg" alt="Microsoft Logo" />
		<span class="buttonText"> Anmelden mit Microsoft</span>
	</button>

	<button id="twitter" type="button" class="provider" on:click={login} value="twitter">
		<img src="/twitter.svg" alt="Facebook Logo" />
		<span class="buttonText"> Anmelden mit Twitter</span>
	</button>
</section>

<style lang="scss">
	// @import url('https://fonts.googleapis.com/css?family=Roboto');

	@use "./variables.scss" as *;

	@font-face {
		font-family: SegoeUI;
		src: local('Segoe UI'),
			url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2)
				format('woff2'),
			url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff)
				format('woff'),
			url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf)
				format('truetype');
		font-weight: 400;
	}

	:global(.icon) {
		position: absolute;
		padding: 3px;
		min-width: 40px;
		color: #000;
	}

	section {
		margin: 1em;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.wrapper {
		display: block;
		width: 17.2em;

		@media screen and (min-width: $sm) {
			width: 19em;
		}
	}

	form {
		display: flex;
		flex-direction: column;

		> * {
			margin: 0 0 1em 0;
		}

		button {
			margin: 0;
			padding: 0.5em;
			align-self: center;
		}
	}

	a,
	button {
		margin: 1em 0 0 0;
		width: 10em;
		text-align: center;
		text-decoration: none;
		border-radius: 0.5em;
		padding: 0.35em;
		background: white;
	}

	span {
		height: 100%;
	}

	.provider {
		width: 17em;
		display: flex;
		box-shadow: 1px 1px 1px grey;
		align-items: center;
		font-family: 'SegoeUI', sans-serif;
		color: #fff;
		border-radius: 2em;

		img {
			margin-left: 1em;
			width: 30px;
			height: 30px;
			margin-right: 1.2em;
		}
		span {
			font-weight: bold;
			// margin: auto;
			text-align: left;
		}
	}

	#google {
		// font-family: 'Roboto', sans-serif;
		color: #000;
	}

	#microsoft {
		// font-family: 'SegoeUI', sans-serif;
		background: #2f2f2f;
	}

	#facebook {
		background: #3b5998;
	}

	#twitter {
		background: #55acee;
	}

	#register {
		width: 14em;
		padding: 0.5em;
	}
</style>
