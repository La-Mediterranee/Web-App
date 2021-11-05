import { existsSync, mkdirSync } from 'fs';

import { getPath } from '../util/helper.js';
import { DEFAULT_FAVICONS_PATH } from '../util/consts.js';

import type { Sharp } from 'sharp';

interface FaviconGeneratorOptions {
	outDir?: string;
}

export async function generateFavicons(icon: Sharp, options: FaviconGeneratorOptions = {}) {
	console.group('Favicons');
	const { outDir = DEFAULT_FAVICONS_PATH } = options;
	const outDirPath = getPath(outDir);

	console.log('Writing to filesystem path:', outDirPath);

	if (!existsSync(outDirPath)) {
		mkdirSync(outDirPath, { recursive: true });
	}

	const DEFAULT_SIZES = [16, 32, 96, 192];

	const imagePromises = [];

	for (const size of DEFAULT_SIZES) {
		const imagePromise = icon
			.resize(size)
			.toFormat('png')
			.toFile(getPath(outDir, `${size}x${size}.png`));
		imagePromises.push(imagePromise);
	}

	await Promise.all(imagePromises);

	console.log('Finished Favicons');

	console.groupEnd();
}
