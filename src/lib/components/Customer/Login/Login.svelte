<script context="module" lang="ts">
	import { onMount } from 'svelte';
	import { mdiAlert } from '@mdi/js';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';

	import { getCookie, getFocusableChildren } from '$lib/utils';
	import { getAuthContext } from '$lib/firebase/helpers';
	import { account, key, eye, eyeOff } from '$lib/Icons/filled';
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
	import type { Auth, User } from 'firebase/auth';

	type LoginCallback = (auth: Auth) => Promise<LoginInfo | null>;

	const providers = ['google', 'facebook', 'twitter']; //'microsoft'

	// A Map or Object should theoretically be faster than a switch statement
	const providerMethods: {
		[provider: string]: LoginCallback;
	} = Object.create(null, {
		google: { value: signInWithGoogle },
		facebook: { value: signInWithFacebook },
		twitter: { value: signInWithTwitter },
		// microsoft: { value: signInWithMicrosoft },
		github: { value: signInWithGithub },
		discord: { value: signInWithDiscord },
	});

	const minLength = 8;

	const emailPattern =
		'^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$'; // String.raw`^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`

	const rules = {
		email: {
			pattern: emailPattern,
			required: true,
		},
		password: {
			minLength: 8,
			required: true,
		},
	};

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
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Alert from 'svelty-material/components/Alert/Alert.svelte';
	import TextField from 'svelty-material/components/TextField/TextField.svelte';

	import t from '$i18n/i18n-svelte';

	import { session } from '$app/stores';
	import Button from 'svelty-material/components/Button/Button.svelte';
	import Link from 'svelty-material/components/Button/Link.svelte';

	const auth = getAuthContext();

	let form: HTMLFormElement | null = null;
	let email: string | undefined = undefined;
	let password: string | undefined = undefined;
	let show: boolean = false;
	let error: boolean = false;

	let abortController: AbortController;
	let loginView: HTMLDivElement;
	let disabled = false;

	async function login(e: MouseEvent | Event) {
		try {
			let userObject: LoginInfo | null = null;

			const target = e.currentTarget as HTMLButtonElement;
			const value = target.value;

			disabled = true;

			// const focusableChildren = getFocusableChildren(loginView);
			// for (const child of focusableChildren) {
			// 	child.setAttribute('disabled', '');
			// 	child.classList.add('disabled');
			// }

			if (value === 'login') {
				if (!validateInput(email!, password!)) return;

				userObject = await signIn(auth, email!, password!);

				if (typeof PasswordCredential !== 'undefined') {
					const passwordcred = new PasswordCredential({
						id: email!,
						type: 'password',
						password: password!,
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
				const token = await user.getIdToken();
				const csrfToken = getCookie('csrfToken');

				const res = await fetch('/api/session/login', {
					method: 'post',
					headers: {
						'content-type': 'application/json;',
						// 'credentials': 'same-origin',
						'credentials': 'include',
					},
					body: JSON.stringify({
						idToken: token,
						csrfToken: csrfToken,
					}),
					signal: abortController.signal,
				});

				if (res.ok) {
					throw new Error(res.statusText);
				}

				const body = await res.json();
				const url = body.location;

				window.location.replace(url);
			} else {
				error = true;
			}

			// for (const child of focusableChildren) {
			// 	child.removeAttribute('disabled');
			// }
		} catch (err) {
			console.error(err);
			error = true;
		} finally {
			disabled = false;
		}
	}

	onMount(() => {
		abortController = new AbortController();

		return () => {
			abortController.abort();
		};
	});
</script>

<div id="login-view" bind:this={loginView}>
	<div class="login-error" on:click={() => (error = !error)}>
		<Alert
			class="error-color"
			transition={slide}
			transitionOpts={{ duration: 500 }}
			bind:visible={error}
		>
			<div slot="icon">
				<Icon path={mdiAlert} />
			</div>
			Es gab ein Fehler beim Einloggen.
		</Alert>
	</div>

	<h1>{$t.customer.login()}</h1>

	<section id="emailPassword">
		<form
			bind:this={form}
			on:submit|preventDefault={login}
			name="login"
			method="post"
			action="/api/auth/login"
		>
			<div class="wrapper">
				<TextField
					bind:value={email}
					type="email"
					name="email"
					autocomplete="email"
					rules={emailRules}
					pattern={emailPattern}
					{disabled}
					required
					filled
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
					{disabled}
					required
					rounded
					filled
				>
					<div slot="prepend">
						<Icon style="color:#fff" path={key} />
					</div>
					Passwort
					<svelte:fragment slot="append">
						<Button
							icon
							on:click={() => {
								show = !show;
							}}
						>
							<Icon style="cursor: pointer; color:#fff;" path={show ? eye : eyeOff} />
						</Button>
					</svelte:fragment>
				</TextField>
			</div>

			<Button
				style="--theme-app-bar: white; color: black"
				type="submit"
				value="login"
				rounded
				{disabled}
			>
				{$t.customer.login()}
			</Button>

			<!-- <button value="login" {disabled}>{$t.customer.login()}</button> -->
		</form>

		<Link
			style="--theme-app-bar: white; color: black"
			id="register"
			href="./register"
			role="button"
			{disabled}
			rounded
		>
			{$t.customer.signUp()}
		</Link>
	</section>

	<section>
		<h2>Weiter Optionen:</h2>
		<noscript> Diese Optionen sind nur mit JS verfügbar </noscript>
		{#each providers as provider}
			{@const text = provider.charAt(0).toUpperCase() + provider.slice(1)}
			<button
				id={provider}
				type="button"
				class="s-btn provider"
				value={provider}
				{disabled}
				on:click={login}
			>
				<img src="/svg/{provider}.svg" alt="{provider} Logo" />
				<span class="buttonText"> {'Anmelden mit'} {text}</span>
			</button>
		{/each}
	</section>

	<section>
		<h2>Für Devs:</h2>
		<button
			id="github"
			type="button"
			class="s-btn provider"
			value="github"
			{disabled}
			on:click={login}
		>
			<img src="/svg/github.svg" alt="Github Logo" />
			<span class="buttonText"> Anmelden mit Github</span>
		</button>
	</section>

	<section>
		<h2>Für Gamer:</h2>
		<button
			id="discord"
			type="button"
			class="s-btn provider"
			value="discord"
			{disabled}
			on:click={login}
		>
			<img src="/svg/discord.svg" alt="Discord Logo" />
			<span class="buttonText"> Anmelden mit Discord</span>
		</button>
	</section>
</div>

<style lang="scss" src="./Login.scss">
</style>
