function formatClass(klass: string) {
	return klass.split(' ').map((i) => {
		if (/^(lighten|darken|accent)-/.test(i)) {
			return `text-${i}`;
		}
		return `${i}-text`;
	});
}

function setTextColor(node: HTMLElement, text: string) {
	if (/^(#|rgb|hsl|currentColor)/.test(text)) {
		// This is a CSS hex.
		node.style.color = text;
		return [];
	}
	if (text.startsWith('--')) {
		// This is a CSS variable.
		node.style.color = `var(${text})`;
		return [];
	}
	const klass = formatClass(text);
	node.classList.add(...klass);
	return klass;
}

export default (node: HTMLElement, text: string | boolean) => {
	let klass: string[];
	if (typeof text === 'string') {
		klass = setTextColor(node, text);
	}

	return {
		update(newText: string) {
			if (klass.length !== 0) {
				node.classList.remove(...klass);
			} else {
				node.style.color = '';
			}

			if (typeof newText === 'string') {
				klass = setTextColor(node, newText);
			}
		}
	};
};
