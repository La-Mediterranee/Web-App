/**
 * Set the focus to the first element with `autofocus` with the element or the
 * element itself
 *
 * @param node
 */
export function moveFocusToDialog(node: HTMLElement) {
	const focused = node.querySelector<HTMLElement>('[autofocus]') || node;
	focused.focus();
}
