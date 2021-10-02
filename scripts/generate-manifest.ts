import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import website from './config/website';

import type { WebApplicationManifest, Mutable } from './manifest';

const DEFAULT_SIZES = [128, 144, 152, 192, 256, 512] as const;

const __dirname = path.resolve();
const iconsDirectory = path.join(__dirname, 'static/icons');
const manifestFile = path.join(__dirname, 'static/manifest.webmanifest');

const {
	backgroundColor,
	icons,
	siteShortName,
	siteName,
	themeColor,
	categories,
	screenshots,
	lang,
	direction,
} = website;

console.log('Generating Images');

const icon = '';

const iconImage = sharp(icon);

const resizeIcon = ({ size, path }) => {
	iconImage.resize(size).toFile(path, (err) => {
		if (err) {
			console.error(err);
		}
	});
};

const main = async () => {
	try {
		const { height, width } = await iconImage.metadata();
		const maxSize = Math.min(width, height);
		const sizes = DEFAULT_SIZES.filter((element) => element <= maxSize);

		const manifest: WebApplicationManifest<any> = {
			name: siteName,
			dir: direction || 'ltr',
			lang: lang || 'de',
			short_name: siteShortName,
			scope: '/',
			start_url: '/?utm_source=homescreen',
			display: 'standalone',
			orientation: 'portrait',
			theme_color: themeColor,
			background_color: backgroundColor,
			categories: (categories as Mutable<typeof categories>) || [
				'food',
				'shopping',
				'fast food',
			],
			icons: sizes.map((size) => {
				const path = `icons/icon-${size}x${size}.png`;
				resizeIcon({ size, path: `static/${path}` });

				return {
					src: path,
					sizes: `${size}x${size}`,
					type: 'image/png',
					purpose: 'maskable',
				};
			}),
			// display_override: [""],
			screenshots: screenshots.map(({ sizes, src, type }) => {
				return {
					src,
					// sizes: `${size}x${size}`,
					sizes,
					type,
					label: '',
				};
			}),
		} as const;

		fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 4));
	} catch (error) {
		console.error(error);
	}
};

console.log('Generating Icons Directory');

fs.mkdir(iconsDirectory, { recursive: true }, (err) => {
	if (err) {
		return console.error(err);
	}
});

console.log('Generating site.webmanifest');

main();
