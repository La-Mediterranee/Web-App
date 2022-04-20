import { SERVER_URL } from '$lib/utils/constants';
import { GROCERY_SEARCH_KEY, ITEM_INFO_SEARCH_KEY, MENU_ITEM_SEARCH_KEY } from './constants';

import type { MenuItem, Product } from 'types/product';
import type { DialogOptions } from '../types';

export const infoModalConfig: DialogOptions = {
	fullscreen: false,
	alignItems: 'center',
	style: '--theme-surface: transparent',
};

export function fetchMenuItem(id: string) {
	return fetch(`${SERVER_URL}/v1/products/${id}?type=menuitem`);
}

export function fetchProduct(id: string) {
	return fetch(`${SERVER_URL}/v1/products/${id}?type=grocery`);
}

export async function checkForProduct(searchParams: URLSearchParams) {
	return checkFor<Product>(searchParams, GROCERY_SEARCH_KEY, fetchProduct);
}

export async function checkForMenuItem(searchParams: URLSearchParams) {
	return checkFor<MenuItem>(searchParams, MENU_ITEM_SEARCH_KEY, fetchMenuItem);
}

export async function checkForInfo(searchParams: URLSearchParams) {
	return checkFor<MenuItem>(searchParams, ITEM_INFO_SEARCH_KEY, fetchMenuItem);
}

export async function checkFor<T>(
	searchParams: URLSearchParams,
	key: string,
	fetcher: (id: string) => Promise<Response>,
): Promise<T | null | undefined> {
	if (!searchParams.has(key)) return;

	const id = searchParams.get(key)!;
	const res = await fetcher(id);
	if (!res.ok) return null;
	const item = await res.json();
	return item;
}
