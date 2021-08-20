<script context="module" lang="ts">
	export interface OpenParams {
		Component: SvelteComponentConstructor<any, any>;
		props?: Object;
		options?: Object;
		callback?: {
			onOpen?: (event: Event) => void;
			onClose?: (event: Event) => void;
			onOpened?: (event: Event) => void;
			onClosed?: (event: Event) => void;
		};
	}

	export type CloseParam =
		| {
				onClose?: (event: Event) => void;
				onClosed?: (event: Event) => void;
		  }
		| MouseEvent;

	export type open = (params: OpenParams) => void;
	export type close = (callback: CloseParam) => void;
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onMount, setContext } from 'svelte';

	export let styleBg = {};
	export let styleWindow = {};
	export let styleContent = {};
	export let styleCloseButton = {};
	export let show: OpenParams | null = null;
	export let key = 'modal';
	export let transitionOverlay = fade;
	export let transitionModal = transitionOverlay;
	export let transitionOverlayProps = { duration: 250 };
	export let transitionModalProps = transitionOverlayProps;

	let Component: SvelteComponentConstructor<any, any> | null;
	let ComponentProps = {};
	let isMounted = false;
	let overlay: HTMLDivElement;
	let modal: HTMLDivElement;
	let currentTransitionOverlay: (
		arg0: HTMLDivElement,
		arg1: { duration: number }
	) => SvelteTransitionReturnType;
	let currentTransitionModal: (
		arg0: HTMLDivElement,
		arg1: { duration: number }
	) => SvelteTransitionReturnType;

	let scrollY: number;
	let cssBg: string | undefined;
	let cssWindow: string | undefined;
	let cssContent: string | undefined;
	let cssCloseButton: string | undefined;

	const dispatch = createEventDispatcher();

	const toVoid = (e: Event) => {};
	let onOpen = toVoid;
	let onClose = toVoid;
	let onOpened = toVoid;
	let onClosed = toVoid;

	const camelCaseToDash = (str: string) =>
		str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

	interface toCssStringProps {
		[key: string]: string | number;
	}

	const toCssString = (props: toCssStringProps) =>
		props
			? Object.keys(props).reduce(
					(str, key) =>
						`${str}; ${camelCaseToDash(key)}: ${props[key]}`,
					''
			  )
			: '';

	const isFunction = (f: Function | Object | null) =>
		!!(f && f.constructor && (f as Function).call && (f as Function).apply);

	const updateStyleTransition = () => {
		cssBg =
			toCssString(
				Object.assign(
					{},
					{
						width: window.innerWidth,
						height: window.innerHeight,
					},
					styleBg
				)
			) || undefined;
		cssWindow = toCssString(styleWindow);
		cssContent = toCssString(styleContent);
		cssCloseButton = toCssString(styleCloseButton);
		currentTransitionOverlay = transitionOverlay;
		currentTransitionModal = transitionModal;
	};

	function open({
		Component: NewComponent,
		props: newProps = {},
		options = {},
		callback = {},
	}: OpenParams) {
		Component = NewComponent;
		ComponentProps = newProps;
		updateStyleTransition();
		disableScroll();
		(onOpen = (event) => {
			if (callback.onOpen) callback.onOpen(event);
			dispatch('open');
		}),
			(onClose = (event) => {
				if (callback.onClose) callback.onClose(event);
				dispatch('close');
			}),
			(onOpened = (event) => {
				if (callback.onOpened) callback.onOpened(event);
				dispatch('opened');
			});
		onClosed = (event) => {
			if (callback.onClosed) callback.onClosed(event);
			dispatch('closed');
		};
	}

	function close(callback?: CloseParam) {
		onClose =
			callback instanceof MouseEvent || callback?.onClose == null
				? onClose
				: callback.onClose;
		onClosed =
			callback instanceof MouseEvent || callback?.onClosed == null
				? onClosed
				: callback.onClosed;
		Component = null;
		enableScroll();
	}

	function handleOuterMouseup(event: MouseEvent) {
		if (
			event.target !== modal &&
			(event.target as HTMLElement)?.closest('div#' + key) !== modal
		) {
			event.preventDefault();
			close();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (Component && event.key === 'Escape') {
			event.preventDefault();
			close();
		}

		if (Component && event.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll<HTMLElement>('*');
			const tabbable = Array.from(nodes).filter(
				(node) => node.tabIndex >= 0
			);

			let index = tabbable.indexOf(document.activeElement as HTMLElement);
			if (index === -1 && event.shiftKey) index = 0;

			index += tabbable.length + (event.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			event.preventDefault();
		}
	}

	function disableScroll() {
		const main = document.getElementById('mainContent') as HTMLDivElement;
		main.tabIndex = -1;
		main?.setAttribute('aria-hidden', 'true');
		scrollY = window.scrollY;
		document.body.style.overflow = 'hidden';
	}

	function enableScroll() {
		const main = document.getElementById('mainContent') as HTMLDivElement;
		main?.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = '';
		window.scrollTo(0, scrollY);
	}

	setContext(key, { open, close });

	onMount(() => {
		isMounted = true;
		return () => {
			if (isMounted) close();
		};
	});

	$: {
		if (isMounted) {
			if (isFunction(show)) {
				open(show!);
			} else {
				close();
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if Component}
	<div
		class="overlay"
		bind:this={overlay}
		on:mouseup={handleOuterMouseup}
		transition:currentTransitionOverlay={transitionOverlayProps}
		style={cssBg}
	>
		<div
			id={key}
			class="modal"
			aria-labelledby=""
			aria-hidden={isMounted ? undefined : true}
			aria-modal="true"
			role="dialog"
			tabindex="0"
			style={cssWindow}
			bind:this={modal}
			transition:currentTransitionModal={transitionModalProps}
			on:introstart={onOpen}
			on:outrostart={onClose}
			on:introend={onOpened}
			on:outroend={onClosed}
		>
			<button on:click={close} class="close" style={cssCloseButton} />
			<svelte:component this={Component} {...ComponentProps} />
		</div>
	</div>
{/if}

<slot />

<style>
	.overlay {
		position: fixed;
		z-index: 1000;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.66);
	}

	.modal {
		position: relative;
		width: 40rem;
		max-width: 100%;
		max-height: 100%;
		margin: 2rem;
		color: black;
		border-radius: 0.5rem;
		background: var(--modal-bg);
	}

	.close {
		display: block;
		box-sizing: border-box;
		position: absolute;
		z-index: 1000;
		top: 1rem;
		right: 1rem;
		margin: 0;
		padding: 0;
		width: 1.5rem;
		height: 1.5rem;
		border: 0;
		color: black;
		border-radius: 1.5rem;
		background: white;
		box-shadow: 0 0 0 1px black;
		transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
			background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
		-webkit-appearance: none;
	}

	.close:before,
	.close:after {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		top: 50%;
		width: 1rem;
		height: 1px;
		background: black;
		transform-origin: center;
		transition: height 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
			background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
	}

	.close:before {
		-webkit-transform: translate(0, -50%) rotate(45deg);
		-moz-transform: translate(0, -50%) rotate(45deg);
		transform: translate(0, -50%) rotate(45deg);
		left: 0.25rem;
	}

	.close:after {
		-webkit-transform: translate(0, -50%) rotate(-45deg);
		-moz-transform: translate(0, -50%) rotate(-45deg);
		transform: translate(0, -50%) rotate(-45deg);
		left: 0.25rem;
	}

	.close:hover {
		background: black;
	}

	.close:hover:before,
	.close:hover:after {
		height: 2px;
		background: white;
	}

	.close:focus {
		border-color: #3399ff;
		box-shadow: 0 0 0 2px #3399ff;
	}

	.close:active {
		transform: scale(0.9);
	}

	.close:hover,
	.close:focus,
	.close:active {
		outline: none;
	}
</style>
