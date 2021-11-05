import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { DEFAULT_BROWSERCONFIG_PATH } from '../util/consts.js';
import { getPath } from '../util/helper.js';

/**
 * a good resource for the look of the images: https://webdesign.tutsplus.com/tutorials/how-to-add-windows-tiles-to-your-website--cms-23099
 *
 * @param images - the images for msedge and ie for pinning
 * @param tileColor - color for msedge and ie for pinning
 * @returns config file as a string
 */
function render(images: BrowserconfigImage[], tileColor: string) {
	return `<?xml version="1.0" encoding="utf-8"?>
			<browserconfig>
			<msapplication>
				<tile>
				<TileColor>${tileColor}</TileColor>
					${images.map((logo) => {
						return `<${logo.form || 'square' + logo.width + 'x' + logo.height + 'logo'} src=${logo.src} />`;
					})}	
				</tile>
			</msapplication>
			</browserconfig>`;
}

export function generateBrowserconfig(browserConfig: { config: Browserconfig; outPath?: string }) {
	const { outPath = DEFAULT_BROWSERCONFIG_PATH, config } = browserConfig;
	const outDirPath = getPath(outPath);

	if (!existsSync(outDirPath)) {
		mkdirSync(outDirPath, { recursive: true });
	}

	writeFileSync(getPath(outPath), render(config.logos, config.tileColor));
}
