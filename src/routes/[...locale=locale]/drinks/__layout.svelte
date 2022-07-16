<script context="module" lang="ts">
	import type { LoadOutput } from '@sveltejs/kit/types';
	import { onMount } from 'svelte';

	const routeName = 'drinks';

	export async function load(): Promise<LoadOutput> {
		return {
			stuff: {
				activeRoute: routeName,
			},
		};
	}

	function slideInlineStart(
		node: HTMLElement,
		options: {
			duration: number;
			delay: number;
		},
	) {
		const prop = document.documentElement.dir === 'ltr' ? 'left' : 'right';

		node.style[prop] = '100%';

		return {
			duration: options.duration,
			css: (t: number) => {
				return `
				top: 0;
				${prop}: ${(1 - t) * 100}%;
			`;
			},
		};
	}

	type Custom<E extends Event = Event, T extends EventTarget = HTMLElement> = E & {
		currentTarget: EventTarget & T;
	};

	function reset<E extends Event = Event>(e: Custom<E, HTMLDivElement>) {
		const prop = document.documentElement.dir === 'ltr' ? 'left' : 'right';
		e.currentTarget.style[prop] = '0';
		document.documentElement.classList.remove('overflow-x-hidden');
	}
</script>

<script lang="ts">
	onMount(() => console.debug('drinks mounted'));
</script>

<slot />
<!-- 
<div
	class="drinksRoute"
	in:slideInlineStart={{ delay: 0, duration: 500 }}
	on:introstart={() => document.documentElement.classList.add('overflow-x-hidden')}
	on:introend={reset}
>
</div>

<style global>
	.drinksRoute {
		position: relative;
		overflow-x: hidden;
	}
</style> -->
