<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onMount, setContext } from 'svelte';

	import type { SvelteComponent } from 'svelte';

	export let key = 'simple-modal';

	let Component: SvelteComponent | null;
	let ComponentProps = {};
	let isMounted = false;
	let opened = false;

	let prevBodyPosition = '';
	let prevBodyOverflow = '';

	const dispatch = createEventDispatcher();

	const toVoid = (e: Event) => {};
	let onOpen = toVoid;
	let onClose = toVoid;
	let onOpened = toVoid;
	let onClosed = toVoid;

	const camelCaseToDash = (str: string) =>
		str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

	interface toCssStringProps {
		[key: string]: string;
	}

	const toCssString = (props: toCssStringProps) =>
		props
			? Object.keys(props).reduce(
					(str, key) =>
						`${str}; ${camelCaseToDash(key)}: ${props[key]}`,
					''
			  )
			: '';

	const isFunction = (f: Function | Object) =>
		!!(f && f.constructor && (f as Function).call && (f as Function).apply);

	const updateStyleTransition = () => {
		// cssBg = toCssString(
		// 	Object.assign(
		// 		{},
		// 		{
		// 			width: window.innerWidth,
		// 			height: window.innerHeight,
		// 		},
		// 		state.styleBg
		// 	)
		// );
		// cssWindowWrap = toCssString(state.styleWindowWrap);
		// cssWindow = toCssString(state.styleWindow);
		// cssContent = toCssString(state.styleContent);
		// cssCloseButton = toCssString(state.styleCloseButton);
		// currentTransitionBg = state.transitionBg;
		// currentTransitionWindow = state.transitionWindow;
	};

	interface OpenParams {
		Component: SvelteComponent;
		props?: Object;
		options?: Object;
		callback: {
			onOpen?: (event: Event) => void;
			onClose?: (event: Event) => void;
			onOpened?: (event: Event) => void;
			onClosed?: (event: Event) => void;
		};
	}

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

	type CloseParam =
		| {
				onClose?: (event: Event) => void;
				onClosed?: (event: Event) => void;
		  }
		| MouseEvent;

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

	function handleKeydown(event: KeyboardEvent) {
		if (Component && event.key === 'Escape') {
			event.preventDefault();
			close();
		}
	}

	function disableScroll() {
		const main = document.getElementById('mainContent') as HTMLDivElement;
		main.tabIndex = -1;
		main.setAttribute('aria-hidden', 'true');
		scrollY = window.scrollY;
		prevBodyPosition = document.body.style.position;
		prevBodyOverflow = document.body.style.overflow;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.overflow = 'hidden';
	}

	function enableScroll() {
		const main = document.getElementById('mainContent') as HTMLDivElement;
		main.setAttribute('aria-hidden', 'false');
		document.body.style.position = prevBodyPosition || '';
		document.body.style.top = '';
		document.body.style.overflow = prevBodyOverflow || '';
		window.scrollTo(0, scrollY);
	}

	setContext(key, { open, close });

	onMount(() => {
		isMounted = true;
		return () => {
			if (isMounted) close();
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<slot />

{#if Component}
	<div class="overlay">
		<div
			aria-labelledby=""
			aria-hidden={isMounted ? undefined : true}
			aria-modal="true"
			role="dialog"
			tabindex="0"
		>
			<button on:click={close} class="close" />
			<svelte:component this={Component} />
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		z-index: 1000;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.66);
	}
</style>
