import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import website from './config/website';

const DEFAULT_SIZES = [128, 144, 152, 192, 256, 512] as const;

const __dirname = path.resolve();
const iconsDirectory = path.join(__dirname, 'static/icons');
const manifestFile = path.join(__dirname, 'static/site.webmanifest');

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

const iconImage = sharp(icons);

const resizeIcon = async ({ size, path }) => {
	await iconImage.resize(size).toFile(path, (err) => {
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

		const manifest = {
			dir: direction || 'ltr',
			lang: lang || 'de',
			name: siteName,
			short_name: siteShortName,
			scope: '/',
			start_url: '/?utm_source=homescreen',
			display: 'standalone',
			orientation: 'portrait',
			theme_color: themeColor,
			background_color: backgroundColor,
			categories: categories || ['food', 'shopping', 'fast food'],
			icons: sizes.map((size) => {
				const path = `icons/icon-${size}x${size}.png`;
				resizeIcon({ size, path: `static/${path}` });

				return {
					src: path,
					sizes: `${size}x${size}`,
					type: 'image/png',
					purpose: 'any maskable',
				};
			}),
			screenshots: screenshots.map((size) => {
				return {
					src: path,
					sizes: `${size}x${size}`,
					type: 'image/webp',
				};
			}),
		};

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
