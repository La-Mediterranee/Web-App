import { writable } from 'svelte/store';

const initState = {
	currentSlide: 0,
};

export function createStore() {
	const { subscribe, set, update } = writable(initState);

	function goToSlide(slide: number) {}

	function next({}) {}

	function prev({}) {}
}
