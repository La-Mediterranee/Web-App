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

	import { slide } from 'svelte/transition';
	import { mdiAlert } from '@mdi/js';

	import { goto } from '$app/navigation';
	import { getAuthContext } from '$lib/firebase/helpers';
	import { account, key, eye, eyeOff } from '$lib/Icons/filled';

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
	import Alert from 'svelte-material-components/src/components/Alert';
	import TextField from 'svelte-material-components/src/components/TextField';

	import type { Auth, User } from 'firebase/auth';

	const user = getAuthContext();
	const auth = user?.auth;

	let form: HTMLFormElement | null = null;
	let email: string = '';
	let password: string = '';
	let show: boolean = false;
	let error: boolean = false;

	$: if ($user) {
		goto('/customer');
	}

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
				if (typeof PasswordCredential !== 'undefined') {
					const passwordcred = new PasswordCredential({
						id: email,
						type: 'password',
						password: password,
						iconURL: userObject?.user.photoURL ?? '',
					});
					await navigator.credentials.store(passwordcred);
				}
			} else if (value != null && typeof value === 'string') {
				const cb = providerMethods[value];
				userObject = await cb(auth);
			}

			const user = userObject?.user;

			if (user) {
				// const token = await user.getIdToken();
				// await fetch(`${VITE_SERVER_URL}/auth/login?provider=firebase`, {
				// 	headers: { Authorization: `Bearer ${token}` },
				// });

				// if (userObject?.newUser) {
				// 	db.collection('users').doc(user.uid).set({ email });
				// }

				goto('/customer');

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

<div class="login-error" on:click={() => (error = !error)}>
	<Alert class="error-color" transition={slide} transitionOpts={{ duration: 500 }} bind:visible={error}>
		<div slot="icon">
			<Icon path={mdiAlert} />
		</div>
		Es gab ein Fehler beim Einloggen.
	</Alert>
</div>

<h1>Login</h1>

<section id="emailPassword">
	<form bind:this={form} on:submit|preventDefault={login} name="login" novalidate>
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
					<Icon style="cursor: pointer; color:#fff;" path={show ? eye : eyeOff} />
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
	<button id="google" type="button" class="provider" value="google" on:click={login}>
		<img src="/svg/google.svg" alt="Google Logo" />
		<span class="buttonText"> Anmelden mit Google</span>
	</button>

	<button id="facebook" type="button" class="provider" value="facebook" on:click={login}>
		<img src="/svg/facebook.svg" alt="Facebook Logo" />
		<span class="buttonText"> Anmelden mit Facebook</span>
	</button>

	<button id="microsoft" type="button" class="provider" value="microsoft" on:click={login}>
		<img src="/svg/microsoft.svg" alt="Microsoft Logo" />
		<span class="buttonText"> Anmelden mit Microsoft</span>
	</button>

	<button id="twitter" type="button" class="provider" value="twitter" on:click={login}>
		<img src="/svg/twitter.svg" alt="Facebook Logo" />
		<span class="buttonText"> Anmelden mit Twitter</span>
	</button>
</section>

<section>
	<h2>Für Devs:</h2>
	<button id="github" type="button" class="provider" value="github" on:click={login}>
		<img src="/svg/github.svg" alt="Github Logo" />
		<span class="buttonText"> Anmelden mit Github</span>
	</button>
</section>

<section>
	<h2>Für Gamer:</h2>
	<button id="discord" type="button" class="provider" value="discord" on:click={login}>
		<img src="/svg/discord.svg" alt="Discord Logo" />
		<span class="buttonText"> Anmelden mit Discord</span>
	</button>
</section>

<style lang="scss" src="./Login.scss">
</style>
