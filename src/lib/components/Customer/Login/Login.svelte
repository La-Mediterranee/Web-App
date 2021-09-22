<script context="module" lang="ts">
	import {
		signIn,
		signInWithGoogle,
		signInWithFacebook,
		signInWithMicrosoft,
		signInWithTwitter,
		signInWithGithub,
		signInWithDiscord,
	} from '$utils/login';

	import type { LoginInfo } from '$utils/login';

	type LoginCallback = (auth: Auth) => Promise<LoginInfo | null>;

	// A Map or Object should theoretically be faster than a switch statement

	const providerMethods: {
		[provider: string]: LoginCallback;
	} = Object.create(null, {
		google: { value: signInWithGoogle },
		facebook: { value: signInWithFacebook },
		twitter: { value: signInWithTwitter },
		microsoft: { value: signInWithMicrosoft },
		github: { value: signInWithGithub },
		discord: { value: signInWithDiscord },
	});

	// const providerMethods = {
	// 	google: signInWithGoogle,
	// 	facebook: signInWithFacebook,
	// 	twitter: signInWithTwitter,
	// 	microsoft: signInWithMicrosoft,
	// 	github: signInWithGithub,
	// 	discord: signInWithDiscord,
	// };

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
	import Icon from 'svelte-material-components/src/components/Icon';
	import TextField from 'svelte-material-components/src/components/TextField';
	import { VITE_SERVER_URL } from '$lib/utils/constants';
	import { account, key, eye, eyeOff } from '$lib/Icons/filled';

	import type { Auth, User } from 'firebase/auth';

	export let auth: Auth;

	let form: HTMLFormElement | null = null;
	let email: string = '';
	let password: string = '';
	let show: boolean = false;
	let error: unknown = null;

	async function login(e: MouseEvent | Event) {
		let user: User | undefined;

		try {
			let userObject: LoginInfo | null = null;

			const target = e.currentTarget as HTMLButtonElement;
			const value = target.value;
			// new window.AbortSignal();

			if (value === 'login') {
				if (!validateInput(email, password)) {
					return;
				}
				userObject = await signIn(auth, email, password);
				// const passwordcred = new PasswordCredential({
				// 	id: email,
				// 	type: 'password',
				// 	password: password,
				// });
				// await navigator.credentials.store(passwordcred);
			} else if (value !== null) {
				const cb = providerMethods[value] as LoginCallback;
				userObject = await cb(auth);
			}

			const user = userObject?.user;

			if (user) {
				const token = await user.getIdToken();
				await fetch(`${VITE_SERVER_URL}/auth/login?provider=firebase`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				// if (userObject?.newUser) {
				// 	db.collection('users').doc(user.uid).set({ email });
				// }

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
					<Icon style="color:#fff" path={account} />
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
					<Icon style="color:#fff" path={key} />
				</div>
				Passwort
				<div
					slot="append"
					on:click={() => {
						show = !show;
					}}
				>
					<Icon
						style="cursor: pointer; color:#fff;"
						path={show ? eye : eyeOff}
					/>
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
