const throttleWithContext = <T>(fn: Function, wait: number = 300) => {
	let inThrottle: boolean;
	let lastFn: ReturnType<typeof setTimeout>;
	let lastTime: number;

	return function (this: T) {
		const context = this;
		const args = arguments;

		if (!inThrottle) {
			fn.apply(context, args);
			lastTime = Date.now();
			inThrottle = true;
		} else {
			clearTimeout(lastFn);
			lastFn = setTimeout(() => {
				if (Date.now() - lastTime >= wait) {
					fn.apply(context, args);
					lastTime = Date.now();
				}
			}, Math.max(wait - (Date.now() - lastTime), 0));
		}
	};
};

function throttle(fn: Function, wait: number = 300) {
	let inThrottle: boolean;

	return (...args: unknown[]) => {
		if (!inThrottle) {
			fn(args);
			inThrottle = true;
		}
	};
}

export default throttle;
