import { onMount } from 'svelte';
import { readable, writable } from 'svelte/store';

import type { Readable, Subscriber, Unsubscriber } from 'svelte/store';

export const rtl2 = readable(false, set => {
	let observer: MutationObserver;

	function handler(mutationList: MutationRecord[]) {
		mutationList.forEach(mutation => {
			console.log(mutation.type);
			const target = mutation.target as HTMLElement;
			set(target.dir === 'rtl');
		});
	}

	onMount(() => {
		const root = document.documentElement;
		const body = document.body;

		observer = new MutationObserver(handler);

		observer.observe(root, {
			attributes: true,
			attributeFilter: ['dir'],
		});

		observer.observe(body, {
			attributes: true,
			attributeFilter: ['dir'],
		});

		return () => observer.disconnect();
	});
});

export const rtl = writable(false);

export default rtl;
