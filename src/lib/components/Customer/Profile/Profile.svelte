<script lang="ts">
	import t from '$i18n/i18n-svelte';
	import Icon from 'svelty-material/components/Icon/Icon.svelte';
	import Button from 'svelty-material/components/Button/Button.svelte';
	import Select from 'svelty-material/components/Select/Select.svelte';

	import { session } from '$app/stores';
	import { goto } from '$app/navigation';

	import { locales } from '$i18n/i18n-util';

	import type { User } from 'firebase/auth';

	export let user: User;
	let loading = false;
</script>

<div>
	<h1>{$t.customer.account()}</h1>

	<section>
		<img
			src={`${user.photoURL || ''}`}
			alt={`${user.displayName || 'Users'} Profilbild`}
			referrerpolicy="no-referrer"
		/>

		<h3>{user.displayName}</h3>
	</section>

	<section>
		<h2>{$t.customer.settings()}</h2>

		<section>
			<h3>{$t.customer.paymentMethods()}</h3>
		</section>

		<section>
			<h3 id="languages">{$t.customer.language()}</h3>
			<div class="no-js-hidden">
				<Select filled items={locales}>
					{$session.locale}
				</Select>
			</div>
			<form action="/api/customer" method="post">
				<div class="select filled">
					<label for="input1" class="visually-hidden">Form Field Label</label>
					<select
						aria-labelledby="languages"
						id="language-selector"
						name="language-selector"
					>
						{#each locales as locale}
							<option value={locale} selected={locale === $session.locale}>
								{locale}
							</option>
						{/each}
					</select>
				</div>
			</form>
			<noscript>
				<!-- k -->
			</noscript>
		</section>
	</section>

	<Button
		type="button"
		size="x-large"
		class="form-elements-color"
		rounded
		on:click={async () => {
			// await user.logOut();
			loading = true;

			const res = await fetch('/api/session/logout', {
				method: 'head',
				credentials: 'include',
			});

			if (!res.ok) {
				loading = false;

				return;
			}

			$session.user = undefined;
			goto($session.urlLocale);
			// window.location.replace($session.urlLocale);
		}}
	>
		{$t.customer.logout()}
	</Button>
</div>

<style lang="scss">
	img {
		width: 7em;
		height: 7em;
	}

	div {
		text-align: center;
	}

	section {
		margin-bottom: 0.75rem;
	}

	.select {
		--select-border: #000;
		--select-arrow: var(--select-border);

		cursor: pointer;
		display: grid;
		grid-template-areas: 'select';
		position: relative;
		align-items: center;

		width: 100%;
		line-height: 1.1;
		border-radius: 0.25em;
		// border: 1px solid var(--select-border);
		padding-inline-start: 12px;

		color: var(--theme-text-secondary);
		caret-color: var(--theme-text-secondary);

		&:focus,
		&:focus-within {
			color: var(--primary-text-color);
			caret-color: var(--primary-text-color);
		}

		&::before {
			content: '';
			position: absolute;
			width: inherit;
			left: 0;
			bottom: -1px;
			border-radius: inherit;
			transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
			pointer-events: none;
		}

		&::after {
			content: '';
			justify-self: end;

			z-index: 0;
			width: 0.65em;
			height: 0.4em;
			margin-inline-end: 1em;
			background-color: currentColor;
			clip-path: polygon(100% 0%, 0 0%, 50% 100%);
		}

		&.filled {
			min-height: 56px;
			border-radius: 4px 4px 0 0;
			background-color: var(--theme-text-fields-filled);

			&::before {
				border-style: solid;
				border-color: currentColor;
				border-width: var(--theme-text-fields-border-width, thin 0 0 0);
			}
		}
	}

	select,
	.select:after {
		grid-area: select;
	}

	#language-selector {
		cursor: pointer;
		appearance: none;
		position: relative;
		padding: 8px 0;
		max-width: 100%;
		outline: none;

		color: inherit;
		caret-color: inherit;

		// &:focus,
		// &:focus-within {
		// 	color: var(--primary-text-color);
		// 	caret-color: var(--primary-text-color);
		// }
	}
</style>
