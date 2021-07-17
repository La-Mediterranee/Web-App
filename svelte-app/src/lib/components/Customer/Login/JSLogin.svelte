<script lang="ts">
	import { goto } from '$app/navigation';

	import {
		signIn,
		signInWithGoogle,
		signInWithFacebook,
		signInWithMicrosoft
	} from '$utils/login';

	import type { Auth } from 'firebase/auth';

	let auth: Auth;
	let error: unknown = null;
	let form: HTMLFormElement | null = null;
	let show: boolean = false;

	let emailValue: string = '';
	let passwordValue: string = '';
	let emailError: HTMLSpanElement;
	let passwordError: HTMLSpanElement;
	let emailValid: boolean = true;
	let passwordValid: boolean = true;

	function validateEmail() {
		const emailElement: HTMLInputElement | undefined = form?.elements['email' as any] as
			| HTMLInputElement
			| undefined;

		if (emailElement?.validity.valid) {
			emailValid = true;
			// In case there is an error message visible, if the field
			// is valid, we remove the error message.
			emailError.textContent = ''; // Reset the content of the message
		} else {
			// If there is still an error, show the correct error
			showEmailError();
		}
	}

	function validatePassword() {
		const passwordElement: HTMLInputElement | undefined = form?.elements['password' as any] as
			| HTMLInputElement
			| undefined;

		if (passwordElement?.validity.valid) {
			passwordValid = true;
			passwordError.textContent = ''; // Reset the content of the message
		} else {
			// If there is still an error, show the correct error
			showPasswordError();
		}
	}

	function showEmailError() {
		const emailElement: HTMLInputElement | undefined = form?.elements['email' as any] as
			| HTMLInputElement
			| undefined;

		emailValid = false;

		if (emailElement?.validity.valueMissing) {
			emailError.textContent = 'Bitte eine valide Email eingeben.';
		} else if (emailElement?.validity.typeMismatch) {
			emailError.textContent = 'Die Eingabe muss eine valide Email sein.';
		}
	}

	function showPasswordError() {
		const passwordElement: HTMLInputElement | undefined = form?.elements['password' as any] as
			| HTMLInputElement
			| undefined;

		passwordValid = false;

		if (passwordElement?.validity.tooShort) {
			passwordError.textContent = `Das Passwort muss ${passwordElement.minLength} Zeichen lang sein.`;
		} else if (passwordElement?.validity.valueMissing) {
			passwordError.textContent = 'Bitte ein Passwort eingeben.';
		} else if (passwordElement?.validity.typeMismatch) {
			passwordError.textContent = 'Die Eingabe muss ein Passwort sein.';
		}
	}

	async function login() {
		const emailElement: HTMLInputElement | undefined = form?.elements['email' as any] as
			| HTMLInputElement
			| undefined;
		const passwordElement: HTMLInputElement | undefined = form?.elements['password' as any] as
			| HTMLInputElement
			| undefined;

		if (!emailElement?.validity.valid) {
			// If it isn't, we display an appropriate error message
			showEmailError();
		} else if (!passwordElement?.validity.valid) {
			showPasswordError();
		}

		const email: string = emailElement!.value;
		const password: string = passwordElement!.value;

		const user = await signIn(auth, email, password);

		if (user) {
			goto('/customer/profil');
		}
	}
</script>

{#if error}
	<div id="error">Es gab ein Fehler beim einloggen</div>
{/if}

<h1>Login</h1>

<section>
	<form bind:this={form} name="login" novalidate>
		<div class="wrapper">
			<label for="email">
				<span> Email: </span>
				<div class="group">
					<input
						name="email"
						type="email"
						on:input={validateEmail}
						bind:value={emailValue}
						required
					/>
				</div>
				<span
					bind:this={emailError}
					class="error"
					class:active={!emailValid}
					aria-live="polite"
				/>
			</label>
		</div>
		<div class="wrapper">
			<label for="password">
				<span> Password: </span>

				<div class="group">
					<input
						name="password"
						type="password"
						minlength="8"
						on:input={validatePassword}
						bind:value={passwordValue}
						required
					/>
				</div>

				<span
					bind:this={passwordError}
					class="error"
					class:active={!passwordValid}
					aria-live="polite"
				/>
			</label>
		</div>

		<button on:click|preventDefault={login}>Einloggen</button>
	</form>

	<a id="register" href="/customer/register" role="button">Registrieren</a>
</section>

<section>
	<h2>Weiter Optionen:</h2>
	<button id="google" class="provider" on:click={() => signInWithGoogle(auth)}>
		<!-- <img src="/google.svg" alt="Google Logo" /> -->
		<img src="/google@3x.png" alt="Google Logo" />
		<span class="buttonText"> Anmelden mit Google</span>
	</button>

	<button id="microsoft" class="provider" on:click={() => signInWithMicrosoft(auth)}>
		<img src="/microsoft.svg" alt="Microsoft Logo" />
		<span class="buttonText"> Anmelden mit Microsoft</span>
	</button>

	<button id="facebook" class="provider" on:click={() => signInWithFacebook(auth)}>
		<img src="/facebook.svg" alt="Facebook Logo" />
		<span class="buttonText"> Anmelden mit Facebook</span>
	</button>
</section>

<style lang="scss">
	// @import url('https://fonts.googleapis.com/css?family=Roboto');

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

	section {
		margin: 1em;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.wrapper {
		display: block;
		width: 18em;
	}

	form {
		display: flex;
		flex-direction: column;

		> * {
			margin: 0 0 1em 0;
		}

		span {
			display: block;
		}

		button {
			margin: 0;
			padding: 0.5em;
			align-self: center;
		}
	}

	input {
		background-color: #fff;
		appearance: none;
		padding: 0.4em;

		width: 100%;
		border: 1px solid #333;
		border-radius: 0.3em;
		margin: 0;

		text-align: center;

		font-family: inherit;
		font-size: 90%;

		&:focus:invalid {
			outline: none;
		}
		/* This is our style for the invalid fields */
		&:invalid {
			border-color: #900;
			background-color: #fdd;
		}
	}

	a,
	button {
		margin: 1em 0 0 0;
		width: 10em;
		text-align: center;
		text-decoration: none;
		// border: 2px solid black;
		border-radius: 0.5em;
		padding: 0.35em;
		background: white;
	}

	input[name='email']::before {
		background: url('/anonymous.png') no-repeat scroll;
		padding-left: 30px;
	}

	span {
		height: 100%;
	}

	label {
		height: 100%;
	}

	:global(.icon) {
		position: absolute;
		padding: 3px;
		min-width: 40px;
		color: #000;
	}

	.error {
		width: 100%;
		padding: 0;

		font-size: 80%;
		color: white;
		background-color: #900;
		border-radius: 0.2em;

		&.active {
			margin-top: 0.2em;
			padding: 0.4em;
		}
	}

	.provider {
		width: 16.5em;
		display: flex;
		// border: thin solid #888;
		box-shadow: 1px 1px 1px grey;
		align-items: center;
		font-family: 'SegoeUI', sans-serif;
		color: #fff;

		span {
			font-weight: bold;
			margin: auto;
		}

		img {
			margin-left: 1em;
			width: 32px;
			height: 32px;
		}
	}

	#google {
		// font-family: 'Roboto', sans-serif;
		color: #000;
		font-family: 'SegoeUI', sans-serif;
	}

	#microsoft {
		font-family: 'SegoeUI', sans-serif;
		background: #2f2f2f;
	}

	#facebook {
		background: #3b5998;
	}

	#register {
		width: 14em;
		padding: 0.5em;
	}

	#error {
		color: red;
	}
</style>
