const filter = (classes: string[]) => classes.filter((x) => !!x);
const format = (classes: string) => classes.split(' ').filter((x) => !!x);

export default (node: Element, _classes: string[]) => {
	let classes = _classes;
	node.classList.add(...format(filter(classes).join(' ')));
	return {
		update(_newClasses: string[]) {
			const newClasses = _newClasses;
			newClasses.forEach((klass, i) => {
				if (klass) node.classList.add(...format(klass));
				else if (classes[i])
					node.classList.remove(...format(classes[i]));
			});
			classes = newClasses;
		},
	};
};
