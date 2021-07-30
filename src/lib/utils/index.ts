export async function fetchPlus(path: RequestInfo, options = {}) {
	if (navigator.onLine) return fetch(path, options);

	alert(`This operation is not available while offline.`);
	return { offline: true };
}
