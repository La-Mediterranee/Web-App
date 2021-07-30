function format(input: number | string) {
	if (typeof input === 'number') return `${input}px`;
	return input;
}

export default (node: HTMLElement, _styles: Object) => {
	let styles = _styles;
	Object.entries(styles).forEach(([key, value]) => {
		if (value) node.style.setProperty(`--s-${key}`, format(value));
	});

	return {
		update(newStyles: Object) {
			Object.entries(newStyles).forEach(([key, value]) => {
				if (value) {
					node.style.setProperty(`--s-${key}`, format(value));
					//@ts-ignore
					delete styles[key];
				}
			});

			Object.keys(styles).forEach((name) => node.style.removeProperty(`--s-${name}`));

			styles = newStyles;
		}
	};
};
