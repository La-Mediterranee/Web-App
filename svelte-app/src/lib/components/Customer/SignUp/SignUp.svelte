<script lang="ts">
	// [START auth_signup_password_modular]
	import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';

	const auth = getAuth();

	async function signUp(email: string, password: string) {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
		}
	}
	// [END auth_signup_password_modular]
</script>

<!-- markup (zero or more items) goes here -->
<style>
	/* your styles go here */
</style>
