import fs from 'fs';

import { getPath } from '../util/helper.js';
import { DEFAULTS, DEFAULT_MANIFEST_PATH } from '../util/consts.js';

import type { OutputInfo, Sharp } from 'sharp';

const DEFAULT_SIZES = [128, 144, 152, 192, 256, 512] as const;

export async function generateManifest({ manifestOutPath = DEFAULT_MANIFEST_PATH, ...restConfig }: ManifestConfig) {
	console.group('Manifest');
	console.log('Writing to filesystem path:', getPath(manifestOutPath));

	const out = getPath(manifestOutPath);
	fs.writeFileSync(out, await render(restConfig));

	console.log('Finished generating File');
	console.groupEnd();
}

async function render({
	iconsOutDir = 'static/icons/manifest',
	icon: iconImage,
	padding,
	manifest,
}: Omit<ManifestConfig, 'manifestOutPath'>) {
	console.log('Generating Icons Directory');

	const outDir = getPath(iconsOutDir);

	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}

	const resizeImagePromises: Promise<OutputInfo>[] = [];

	const sizes = await getImageSizes(iconImage);

	if (!manifest.icons) {
		(manifest.icons as unknown) = sizes.map((size) => {
			const path = getPath(`./${iconsOutDir}`, `./icon-${size}x${size}.png`);

			const sizeWithPadding = Math.ceil(size * (1 - padding));
			const paddingSize = Math.floor((size * padding) / 2);
			const newImg = iconImage.resize(sizeWithPadding).extend({
				top: paddingSize,
				bottom: paddingSize,
				left: paddingSize,
				right: paddingSize,
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			});

			resizeImagePromises.push(newImg.toFile(path));

			return {
				src: path,
				sizes: `${size}x${size}`,
				type: 'image/png',
				purpose: 'maskable',
			} as ImageResource;
		});
	}

	console.log('Generating site.webmanifest');

	const manifestJSON = createManifestInfo(manifest as ManifestOptions);

	console.log('Waiting for Images');

	await Promise.all(resizeImagePromises);

	console.log('Images finished generating');

	return JSON.stringify(manifestJSON, null, 4);
}

async function getImageSizes(image: Sharp) {
	const { height, width } = await image.metadata();
	const maxSize = Math.min(width || 0, height || 0);
	return DEFAULT_SIZES.filter((element) => element <= maxSize);
}

function createManifestInfo(config: ManifestOptions) {
	const manifest: WebApplicationManifest = {
		name: config.name,
		short_name: config.shortName || config.name,
		theme_color: config.themeColor || DEFAULTS.themeColor,
		background_color: config.backgroundColor || DEFAULTS.backgroundColor,
		icons: config.icons,
		scope: config.scope ?? '/',
		start_url: config.startUrl ?? '/?utm_source=homescreen',
		dir: config.dir || 'ltr',
		lang: config.lang || 'de',
		display: config.display || 'standalone',
		orientation: config.orientation || 'portrait',
		categories: config.categories || ['food', 'shopping', 'fast food'],
		shortcuts: config.shortcuts,
		display_override: config.display_override,
		screenshots: config.screenshots,
		description: config.description,
		iarc_rating_id: config.iarc_rating_id,
		prefer_related_applications: config.prefer_related_applications,
		related_applications: config.related_applications,
		gcm_sender_id: '103953800507',
		gcm_user_visible_only: true,
		capture_links: 'none',
	} as const;

	return manifest;
}
