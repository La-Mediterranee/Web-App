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

export * from './helper';
