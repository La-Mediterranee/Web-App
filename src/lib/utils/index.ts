export async function fetchPlus(path: RequestInfo, options = {}) {
	if (navigator.onLine) return fetch(path, options);

	alert(`This operation is not available while offline.`);
	return { offline: true };
}

export const getGlobal = function () {
	if (typeof self !== 'undefined') {
		return self;
	}

	if (typeof window !== 'undefined') {
		return window;
	}

	if (typeof global !== 'undefined') {
		return global;
	}
};

export const replaceLocaleInUrl = (path: string, locale: string): string => {
	const [, , ...rest] = path.split('/');
	return `/${[locale, ...rest].join('/')}`;
};

export const FOCUSABLE_ELEMENTS = [
	'a[href]:not([tabindex^="-"])',
	'area[href]:not([tabindex^="-"])',
	'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
	'input[type="radio"]:not([disabled]):not([tabindex^="-"])',
	'select:not([disabled]):not([tabindex^="-"])',
	'textarea:not([disabled]):not([tabindex^="-"])',
	'button:not([disabled]):not([tabindex^="-"])',
	'iframe:not([tabindex^="-"])',
	'audio[controls]:not([tabindex^="-"])',
	'video[controls]:not([tabindex^="-"])',
	'[contenteditable]:not([tabindex^="-"])',
	'[tabindex]:not([tabindex^="-"])',
];

function $$<T extends Element = Element>(
	selector: string,
	context: Document | HTMLElement = document,
): T[] {
	return Array.from(context.querySelectorAll<T>(selector));
}

/**
 * Get the focusable children of the given element
 *
 * @param element
 * @returns
 */
export function getFocusableChildren(
	element: HTMLElement | Document = document,
): Array<HTMLElement> {
	return $$<HTMLElement>(FOCUSABLE_ELEMENTS.join(','), element).filter(
		el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
	);
}

interface Pending<T> {
	resolve: (value: T) => void;
	reject: (reason?: any) => void;
}

export function debouncePromise<T>(fn: Function, ms = 0) {
	let timeoutId: number;
	const pending: Pending<T>[] = [];
	return <T1>(...args: T1[]) =>
		new Promise((res, rej) => {
			clearTimeout(timeoutId);

			timeoutId = window.setTimeout(() => {
				const currentPending = [...pending];
				pending.length = 0;
				Promise.resolve(fn.apply(null, args)).then(
					data => {
						currentPending.forEach(({ resolve }) => resolve(data));
					},
					error => {
						currentPending.forEach(({ reject }) => reject(error));
					},
				);
			}, ms);

			pending.push({ resolve: res, reject: rej });
		});
}

/**
 * @param name The cookie name.
 * @return The corresponding cookie value to lookup.
 */
export function getCookie(name: string): string | null {
	const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return v ? v[2] : null;
}

/**
 * The flag emoji is a combination of the two unicode
 * The UTF-16 A is positioned at 65, and we have subtracted this
 * from the region A character index 127462, explaining the hardcoded 127397 value (127462 - 65)
 * To get the correct flag emoji index, we simply add the received index to the offset number.
 *
 * @param countryCode
 * @returns - the unicode string of the flag
 */
export function getFlagEmoji(countryCode: string): string {
	const startIndex = 0x1f1a5; // 127397
	const codePoints = Array.from(countryCode.toUpperCase()).map(
		char => startIndex + char.charCodeAt(0),
	);

	// for V8 spread operator is often the fastest solution
	// but for consistent performance across browsers
	// apply is better: https://jsben.ch/Y5Yt2
	return String.fromCodePoint.apply(null, codePoints);
}

export async function promiseTimeout(ms: number): Promise<number | NodeJS.Timeout> {
	return new Promise(resolve => {
		const id: NodeJS.Timeout | number = setTimeout(() => resolve(id), ms);
	});
}

export * from './helper';
