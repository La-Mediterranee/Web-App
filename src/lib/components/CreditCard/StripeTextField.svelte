<script context="module" lang="ts">
	import type {
		StripeCardNumberElementChangeEvent,
		StripeElement,
		StripeElements,
		StripeElementType,
	} from '@stripe/stripe-js';

	import uid from 'svelty-material/internal/uid';

	const baseStyle = {
		'fontFamily': 'Fira Sans, sans-serif',
		'fontWeight': '600',
		'fontSize': '16px',
		'fontSmoothing': 'antialiased',
		'color': '#ddd',
		'letterSpacing': '1.2px',
		'::placeholder': {
			color: '#ddd',
		},
		':-webkit-autofill': {
			color: '#ddd',
		},
	};
</script>

<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';

	import Input from 'svelty-material/components/Input/Input.svelte';

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
	export let stripeElement: 'card' | 'cardNumber' | 'cardExpiry' | 'cardCvc' = 'card';
	export let iconStyle: 'default' | 'solid' | undefined = undefined;

	let focused = false;
	let errorMessages: string[] = [];
	let notEmpty = false;
	let el: StripeElement;
	$: labelActive = !!placeholder || value || notEmpty || focused;

	onMount(() => {
		el = elements.create(stripeElement as any, {
			placeholder: placeholder === false ? '' : (placeholder as string),
			iconStyle,
			style: {
				base: baseStyle,
			},
		});

		dispatch('createdElement', el);

		el.mount(`#${id}`);

		el.on('blur', onBlur);
		el.on('focus', onFocus);
		el.on('change', onInput);

		return () => {
			console.debug('destroying');
			el.destroy();
		};
	});

	export function validate() {
		errorMessages = rules.map(r => r(value)).filter(r => typeof r === 'string');
		if (errorMessages.length) error = true;
		else {
			error = false;
		}
		return error;
	}

	async function onFocus() {
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

<Input
	class="s-text-field stripe-element {klass}"
	{color}
	{dense}
	{readonly}
	{disabled}
	{error}
	{success}
	{style}
>
	<!-- Slot for prepend outside the input. -->
	<slot slot="prepend-outer" name="prepend-outer" />
	<div
		class="s-text-field__wrapper"
		class:filled
		class:solo
		class:outlined
		class:flat
		class:rounded
	>
		<!-- Slot for prepend inside the input. -->
		<slot name="prepend" />

		<div class="s-text-field__input">
			<slot name="content" />
			<!-- keypress Event is deprecated. Use keydown or keyup instead -->
			<div {id} class="input" />
			<label for={id} class:active={labelActive}>
				<slot />
			</label>

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

<style lang="scss">
	:global(.stripe-element) {
		.outlined .s-text-field__input {
			flex-direction: column;
		}

		.s-text-field__input {
			align-items: center;
		}

		label.active {
			color: var(--theme-primary-text-color, var(--primary-text-color, #6200ee));
		}

		.input {
			padding-block-start: 10px;
			height: 46px;
			display: flex;
			align-items: center;
			background-color: transparent;

			&:global(.StripeElement--webkit-autofill) {
				background-color: transparent !important;
			}

			&::-webkit-autofill {
				background-color: white;
			}
			/* padding: 1em; */
		}
	}
</style>
