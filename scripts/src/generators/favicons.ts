import { existsSync, mkdirSync } from 'fs';

import { getPath } from '../util/helper.js';
import { DEFAULT_FAVICONS_PATH } from '../util/consts.js';

import type { Sharp } from 'sharp';

interface FaviconGeneratorOptions {
	outDir?: string;
}

const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180] as const;
const DEFAULT_SIZES = [16, 32, 96, 192] as const;
// <link rel="apple-touch-icon" sizes="57x57" href="/assets/favicons/apple-touch-icon-57x57.png">
// Icon for Pinned Tabs in Safari with the following Svg structure
// Only one pfad
// Viewbox must set to 16 x 16 → viewBox=“0 0 16 16”
// <link rel="mask-icon" href="/assets/favicons/safari-pinned-tab.svg" color="#5bbad5">

export async function generateFavicons(icon: Sharp, options: FaviconGeneratorOptions = {}) {
	console.group('Favicons');
	const { outDir = DEFAULT_FAVICONS_PATH } = options;
	const outDirPath = getPath(outDir);

	console.log('Writing to filesystem path:', outDirPath);

	if (!existsSync(outDirPath)) {
		mkdirSync(outDirPath, { recursive: true });
	}

	const imagePromises = [];

	for (const size of DEFAULT_SIZES) {
		const imagePromise = icon
			.resize(size)
			.toFormat('png')
			.toFile(getPath(outDir, `${size}.png`));
		imagePromises.push(imagePromise);
	}

	for (const size of APPLE_ICON_SIZES) {
		const imagePromise = icon
			.resize(size)
			.toFormat('png')
			.toFile(getPath(outDir, `${size}.png`));
		imagePromises.push(imagePromise);
	}

	await Promise.all(imagePromises);

	console.log('Finished Favicons');

	console.groupEnd();
}
