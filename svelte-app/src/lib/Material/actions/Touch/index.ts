export default (node: HTMLElement) => {
	let x: number | null = null;
	let y: number | null = null;
	function handleTouchStart(e: TouchEvent) {
		const touch = e.touches[0];
		x = touch.clientX;
		y = touch.clientY;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!(x && y)) return;
		const touch = e.touches[0];

		node.dispatchEvent(
			new CustomEvent('touch', {
				detail: {
					x: touch.clientX - x,
					y: touch.clientY - y,
					clientX: touch.clientX,
					clientY: touch.clientY,
				},
			})
		);
	}

	node.addEventListener('touchstart', handleTouchStart, { passive: true });
	node.addEventListener('touchmove', handleTouchMove, { passive: true });

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchmove', handleTouchMove);
		},
	};
};
