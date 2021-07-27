import jump from "./jump";

export default (
	node: HTMLAnchorElement,
	_options: { target?: string } = {}
) => {
	let options = _options;
	let target =
		options.target || node.getAttribute("data-target") || node.href;
	const Jump = () => {
		jump(target, options);
	};

	node.addEventListener("pointerdown", Jump);

	return {
		update(newOptions: { target?: string } = {}) {
			options = newOptions;
			target =
				options.target || node.getAttribute("data-target") || node.href;
			if (!options) node.removeEventListener("pointerdown", Jump);
		},
		destroy() {
			node.removeEventListener("pointerdown", Jump);
		},
	};
};
