import type { SvelteComponentTyped } from 'svelte';
import type { AlignItems } from 'svelty-material/@types';
import type { MenuItem } from 'types/product';

export interface ModalContext {
	open<T>(
		component: new (...args: any) => SvelteComponentTyped<T>,
		props?: T,
		options?: DialogOptions,
	): void;
	openInfoModal(menuitem: MenuItem): void;
	openMenuItemModal(menuitem: MenuItem): void;
}

export interface DialogOptions {
	alignItems?: AlignItems;
	fullscreen?: boolean;
	style?: string;
}

export interface CloseEventDetail {
	close: Function;
}

export type CloseEvent = CustomEvent<CloseEventDetail>;
