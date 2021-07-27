/* eslint-disable no-param-reassign */

const themeColors = [
	'primary',
	'secondary',
	'success',
	'info',
	'warning',
	'error',
];

function formatClass(klass: string) {
	return klass.split(' ').map((i) => {
		if (themeColors.includes(i)) return `${i}-color`;
		return i;
	});
}

function setBackgroundColor(node: HTMLElement, text: string) {
	if (/^(#|rgb|hsl|currentColor)/.test(text)) {
		// This is a CSS hex.
		node.style.backgroundColor = text;
		return false;
	}

	if (text.startsWith('--')) {
		// This is a CSS variable.
		node.style.backgroundColor = `var(${text})`;
		return false;
	}

	const klass = formatClass(text);
	node.classList.add(...klass);
	return klass;
}

export default (node: HTMLElement, text: string | boolean) => {
	let klass: string | string[] | false;
	if (typeof text === 'string') {
		klass = setBackgroundColor(node, text);
	}

	return {
		update(newText: string) {
			if (klass) {
				node.classList.remove(...klass);
			} else {
				node.style.backgroundColor = '';
			}

			if (typeof newText === 'string') {
				klass = setBackgroundColor(node, newText);
			}
		},
	};
};
