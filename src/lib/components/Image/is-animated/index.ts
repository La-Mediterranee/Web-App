import * as gif from './types/gif';
import * as png from './types/png';
import * as webp from './types/webp';

/**
 * Checks if buffer contains animated image
 */
function isAnimated(buffer: Buffer): boolean {
	if (gif.isGIF(buffer)) {
		return gif.isAnimated(buffer);
	}

	if (png.isPNG(buffer)) {
		return png.isAnimated(buffer);
	}

	if (webp.isWebp(buffer)) {
		return webp.isAnimated(buffer);
	}

	return false;
}

export default isAnimated;
