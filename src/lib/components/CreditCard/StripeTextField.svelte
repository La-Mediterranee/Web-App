<script context="module">
	import type {
		StripeCardNumberElementChangeEvent,
		StripeElement,
		StripeElements,
		StripeElementType,
	} from '@stripe/stripe-js';
	import uid from 'svelte-material-components/src/internal/uid';
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import Input from 'svelte-material-components/src/components/Input';

	const dispatch = createEventDispatcher();

	let klass = '';
	export { klass as class };
	export let value = '';
	export let color = 'primary';
	export let filled = false;
	export let solo = false;
	export let outlined = false;
	export let flat = false;
	export let dense = false;
	export let rounded = false;
	export let readonly = false;
	export let disabled = false;
	export let placeholder: string | false | undefined = undefined;
	export let hint = '';
	export let counter: boolean | number | string = false;
	export let messages: string[] = [];
	export let rules: Function[] = [];
	export let errorCount = 1;
	export let validateOnBlur = false;
	export let error = false;
	export let success = false;
	export let id = `s-input-${uid(5)}`;
	export let style: string = '';
	export let elements: StripeElements;
	export let stripeElement: StripeElementType = 'card';
	export let iconStyle: 'default' | 'solid' | undefined = undefined;

	let focused = false;
	let errorMessages: string[] = [];
	let notEmpty = false;

	$: labelActive = !!placeholder || value || notEmpty || focused;

	onMount(() => {
		const el = elements.create(stripeElement as any, {
			placeholder: placeholder === false ? '' : (placeholder as string),
			iconStyle,
			style: {
				base: {
					fontFamily: 'Fira Sans, sans-serif',
					fontWeight: '530',
					fontSize: '16px',
					fontSmoothing: 'antialiased',
					color: '#ddd',
					'::placeholder': {
						color: '#ddd',
					},
				},
			},
		});

		dispatch('createdElement', el);

		el.mount(`#${id}`);

		el.on('blur', onBlur);
		el.on('focus', onFocus);
		el.on('change', onInput);

		return () => {
			el.destroy();
		};
	});

	export function validate() {
		errorMessages = rules.map((r) => r(value)).filter((r) => typeof r === 'string');
		if (errorMessages.length) error = true;
		else {
			error = false;
		}
		return error;
	}

	function onFocus() {
		focused = true;
	}

	function onBlur() {
		focused = false;
		if (validateOnBlur) validate();
	}

	function onInput(e: StripeCardNumberElementChangeEvent) {
		!e.empty ? (notEmpty = true) : (notEmpty = false);
		if (!validateOnBlur) validate();
	}
</script>

<Input class="s-text-field {klass}" {color} {dense} {readonly} {disabled} {error} {success} {style}>
	<!-- Slot for prepend outside the input. -->
	<slot slot="prepend-outer" name="prepend-outer" />
	<div class="s-text-field__wrapper" class:filled class:solo class:outlined class:flat class:rounded>
		<!-- Slot for prepend inside the input. -->
		<slot name="prepend" />

		<div class="s-text-field__input">
			<label for={id} class:active={labelActive}>
				<slot />
			</label>
			<slot name="content" />
			<!-- keypress Event is deprecated. Use keydown or keyup instead -->
			<div {id} class="input" />

			<!-- Slot for append inside the input. -->
			<slot name="append" />
		</div>
	</div>

	<div slot="messages">
		<div>
			<span>{hint}</span>
			{#each messages as message}<span>{message}</span>{/each}
			{#each errorMessages.slice(0, errorCount) as message}
				<span>
					{message}
				</span>
			{/each}
		</div>
		{#if counter}<span>{value.length} / {counter}</span>{/if}
	</div>

	<!-- Slot for append outside the input. -->
	<slot slot="append-outer" name="append-outer" />
</Input>

<style>
	.s-text-field__input {
		flex-direction: column;
	}

	.input {
		padding: 1em;
	}
</style>
