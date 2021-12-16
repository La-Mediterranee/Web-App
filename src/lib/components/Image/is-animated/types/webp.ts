/**
 * @since 2019-02-27 10:20
 * @author vivaxy
 */

export function isWebp(buffer: Buffer): boolean {
	const WEBP = [0x57, 0x45, 0x42, 0x50];

	for (let i = 0; i < WEBP.length; i++) {
		if (buffer[i + 8] !== WEBP[i]) {
			return false;
		}
	}

	return true;
}

export function isAnimated(buffer: Buffer): boolean {
	const ANIM = [0x41, 0x4e, 0x49, 0x4d];

	for (let i = 0; i < buffer.length; i++) {
		let j = 0;
		for (; j < ANIM.length; j++) {
			if (buffer[i + j] !== ANIM[j]) {
				break;
			}
		}

		if (j === ANIM.length) {
			return true;
		}
	}

	return false;
}
