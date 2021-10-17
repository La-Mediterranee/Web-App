import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import website from './config/website';

const DEFAULT_SIZES = [128, 144, 152, 192, 256, 512] as const;

// const __dirname = path.resolve();
const iconsDirectory = path.join(__dirname, '../static/icons');
const manifestFile = path.join(__dirname, '../static/manifest.webmanifest');

const { backgroundColor, icons, siteShortName, siteName, themeColor, categories, screenshots, lang, direction } =
	website;

const icon = path.resolve(__dirname, '../static/Logos/V1.png');

const iconImage = sharp(icon);

const resizeImagePromises: Promise<sharp.OutputInfo>[] = [];

const resizeIcon = ({ size, path }: { size: number; path: string }) => {
	try {
		resizeImagePromises.push(iconImage.resize(size).toFile(path));
		// , (err) => {
		// 	if (err) {
		// 		console.error(err);
		// 	}
		// }
	} catch (error) {
		console.error(error);
	}
};

const main = async () => {
	try {
		console.log('Generating Icons Directory');

		fs.mkdir(iconsDirectory, { recursive: true }, (err) => {
			if (err) {
				return console.error(err);
			}
		});

		console.log('Generating site.webmanifest');

		const { height, width } = await iconImage.metadata();
		const maxSize = Math.min(width || 0, height || 0);
		const sizes = DEFAULT_SIZES.filter((element) => element <= maxSize);

		const manifest: WebApplicationManifest<any> = {
			dir: direction || 'ltr',
			lang: lang || 'de',
			name: siteName,
			short_name: siteShortName,
			scope: '/',
			start_url: '/?utm_source=homescreen',
			display: 'standalone',
			orientation: 'portrait' || 'any',
			theme_color: themeColor,
			background_color: backgroundColor,
			categories: (categories as Mutable<typeof categories>) || ['food', 'shopping', 'fast food'],
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
			// screenshots: screenshots.map(({ sizes, src, type }) => {
			// 	return {
			// 		src,
			// 		// sizes: `${size}x${size}`,
			// 		sizes,
			// 		type,
			// 		label: '',
			// 	};
			// }),
			gcm_sender_id: '103953800507',
			gcm_user_visible_only: true,
			capture_links: 'none',
		} as const;

		console.log('Finished generating File');

		console.log('Waiting for Images');

		await Promise.all(resizeImagePromises);

		console.log('Images finished generating');

		console.log('Writing to filesystem path:', manifestFile);

		fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 4));

		console.log('Finished Writing');
	} catch (error) {
		console.error(error);
	}
};

main();
