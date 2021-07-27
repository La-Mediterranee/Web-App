/**
 * Click Outside
 */
export default (node: Node, _options = {}) => {
	const options = { include: [], ..._options };

	function detect({ target }: { target: EventTarget | null }) {
		if (
			!node.contains(target as Node) ||
			options.include.some((i) => (target as Node)?.isSameNode(i))
		) {
			node.dispatchEvent(new CustomEvent("clickOutside"));
		}
	}
	document.addEventListener("click", detect, {
		passive: true,
		capture: true,
	});
	return {
		destroy() {
			document.removeEventListener("click", detect);
		},
	};
};
