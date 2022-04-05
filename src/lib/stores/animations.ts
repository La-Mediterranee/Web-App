import { browser, dev } from '$app/env';
import { getContext, onMount, setContext } from 'svelte';
import { writable } from 'svelte/store';

const ioCreater = !browser
	? () =>
			<IntersectionObserver>{
				disconnect: () => {},
			}
	: () => {
			console.debug('creating IO');
			return new IntersectionObserver(entries => {
				entries.forEach(entry => {
					const state = entry.isIntersecting ? '' : 'paused';
					(<HTMLElement>entry.target).style.animationPlayState = state;
					// (<HTMLElement>entry.target).style.setProperty('--animps', state);
				});
			});
	  };

function createAnimationStore() {
	let IO: IntersectionObserver;

	const store = writable(new WeakMap<Element>(), set => {
		IO = ioCreater();

		return () => {
			console.debug('destroying');
			IO.disconnect();
		};
	});

	const { set, subscribe, update } = store;

	/**
	 *
	 * @param el the element with an animation that needs to be observed
	 * @returns a function that removes the element from the list of observed elements. Not calling this function
	 * when the element gets destoyed can cause a memory leak because not all browser use weak references for the
	 * observed elements.
	 */
	function push(el: Element, options = {}) {
		// if (dev) console.debug('pushing', el);
		update(old => old.set(el, options));
		IO.observe(el);

		return function pop() {
			// if (dev) console.debug('popping', el);
			update(old => {
				old.delete(el);
				return old;
			});
			IO.unobserve(el);
		};
	}

	return {
		subscribe,

		push,
	};
}

export type AnimationStore = ReturnType<typeof createAnimationStore>;

const STORE_KEY = Symbol('Animations');

export function setAnimationsContext() {
	const animations = createAnimationStore();
	setContext(STORE_KEY, animations);
	return animations;
}

export function getAnimationsContext(): AnimationStore {
	return getContext(STORE_KEY);
}
