function hasIntlGetCanonicalLocalesBug() {
	try {
		return new Intl.Locale('und-x-private').toString() === 'x-private';
	} catch (e) {
		return true;
	}
}

const polyfills = [];

if (!('FormData' in window)) {
	const src = 'https://cdn.jsdelivr.net/npm/formdata-polyfill@4.0.10/formdata.min.js';
	const script = document.createElement('script');
	script.src = src;
	document.head.appendChild(script);
}

if (!('AbortController' in window)) {
	polyfills.push('AbortController');
}

if (
	!(
		'IntersectionObserver' in window &&
		'IntersectionObserverEntry' in window &&
		'intersectionRatio' in window.IntersectionObserverEntry.prototype
	)
) {
	polyfills.push('IntersectionObserver');
}

if (!('Locale' in Intl) || hasIntlGetCanonicalLocalesBug()) {
	polyfills.push('Intl.Locale');
}

if (polyfills.length > 0) {
	const src = `https://polyfill.io/v3/polyfill.min.js?features=${polyfills.join('%2C')}`;
	const script = document.createElement('script');
	script.src = src;
	document.head.appendChild(script);
}

Promise.allSettled =
	Promise.allSettled ||
	function (promises) {
		let wrappedPromises = [];
		for (const p of promises) {
			wrappedPromises.push(
				Promise.resolve(p).then(
					(value) => ({
						status: 'fulfilled',
						value,
					}),
					(reason) => ({
						status: 'rejected',
						reason,
					})
				)
			);
		}

		return Promise.all(wrappedPromises);
	};
