import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import website from './config/website';
import { fileURLToPath } from 'url';

import type { SharpOptions } from 'sharp';

type PixelDensity = 2 | 3;

//Ipads
type IpadScreeenResolutions = {
	'1536x2048': 2;
	'1668x2224': 2;
	'1620x2160': 2;
	'1668x2388': 2;
	'2048x2732': 2;
};

type IphoneScreeenResolutions = {
	'750x1334': 2;
	'828x1792': 2;
	'1080x1920': 3;
	'1125x2436': 3;
	'1170x2532': 3;
	'1284x2778': 3;
};

type ScreenResolutionsWithDensity = IphoneScreeenResolutions &
	IpadScreeenResolutions;

type ScreenResolutions = {
	'375x667': PixelDensity[];
	'375x812': PixelDensity[];
	'390x844': PixelDensity[];
	'414x736': PixelDensity[];
	'414x896': PixelDensity[];
	'428x926': PixelDensity[];
	'768x1024': PixelDensity[];
	'810x1080': PixelDensity[];
	'834x1112': PixelDensity[];
	'834x1194': PixelDensity[];
	'1024x1366': PixelDensity[];
};

const sizes: Partial<ScreenResolutions> = {
	'375x667': [2] as PixelDensity[],
	'375x812': [3] as PixelDensity[],
	'390x844': [3] as PixelDensity[],
	'414x736': [2, 3] as PixelDensity[],
	'414x896': [2, 3] as PixelDensity[],
	'428x926': [3] as PixelDensity[],
	'768x1024': [2] as PixelDensity[],
	'810x1080': [2] as PixelDensity[],
	'834x1112': [2] as PixelDensity[],
	'834x1194': [2] as PixelDensity[],
	'1024x1366': [2] as PixelDensity[],
} as const;

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createImages(imageBuffer: Buffer) {
	const ipadResolutions: IpadScreeenResolutions = {
		'1536x2048': 2,
		'1620x2160': 2,
		'1668x2224': 2,
		'1668x2388': 2,
		'2048x2732': 2,
	};

	const iphoneResolutions: IphoneScreeenResolutions = {
		'750x1334': 2,
		'828x1792': 2,
		'1080x1920': 3,
		'1125x2436': 3,
		'1170x2532': 3,
		'1284x2778': 3,
	};

	const combined = Object.assign({}, iphoneResolutions, ipadResolutions);

	for (const [size, density] of Object.entries(combined)) {
		const split = size.split('x');

		const portrait = {
			size,
			width: Number(split[0]),
			height: Number(split[1]),
		};

		const landscape = {
			size: `${split[1]}x${split[0]}`,
			width: Number(split[1]),
			height: Number(split[0]),
		};

		const portrtaitPromise = sharp({
			create: {
				channels: 4,
				background: '#fff',
				width: portrait.width,
				height: portrait.height,
			},
		})
			.composite([
				{
					input: imageBuffer,
					gravity: 'center',
				},
			])
			.toFile(
				path.resolve(
					__dirname,
					`./splash-portrait-${portrait.size}.png`
				)
			);

		const landscapePromise = sharp({
			create: {
				channels: 4,
				background: '#fff',
				width: landscape.width,
				height: landscape.height,
			},
		})
			.composite([
				{
					input: imageBuffer,
					gravity: 'center',
				},
			])
			.toFile(
				path.resolve(
					__dirname,
					`./splash-landscape-${landscape.size}.png`
				)
			);

		try {
			const images = await Promise.allSettled([
				landscapePromise,
				portrtaitPromise,
			]);

			console.group('promises');

			const landscapeImg =
				images[0].status === 'fulfilled'
					? images[0].value
					: images[0].reason;

			const portraitImg =
				images[1].status === 'fulfilled'
					? images[1].value
					: images[1].reason;

			console.log(landscapeImg);

			console.log(portraitImg);

			console.groupEnd();

			createMetaTags(portrait.width, portrait.height, density);
		} catch (error) {
			console.error(error);
		}

		// images.set(href, media);
	}
}

function createMetaTags(width: number, height: number, density: number) {
	const portrait = `screen and (device-width: ${
		width / density
	}px) and (device-height: ${
		height / density
	}px) and (-webkit-device-pixel-ratio: ${density}) and (orientation: portrait)`;
	const landscape = `screen and (device-width: ${
		width / density
	}px) and (device-height: ${
		height / density
	}px) and (-webkit-device-pixel-ratio: ${density}) and (orientation: landscape)`;

	return {
		landscape,
		portrait,
	};
}

async function main() {
	const iconsDirectory = path.join(__dirname, '../static/apple/splash');

	const logoPath = path.resolve(__dirname, '../static/Logos/V1.png');
	const images = new Map<string, string>();

	console.log('Creating Image Directoy in', iconsDirectory);

	fs.mkdirSync(iconsDirectory, { recursive: true });

	console.log('Generating Images');

	const LOGO_BUFFER = await sharp(fs.readFileSync(logoPath))
		.resize(512)
		.toBuffer();

	fs.writeFileSync('./scripts/logo512x512.png', LOGO_BUFFER);

	await createImages(LOGO_BUFFER);

	console.log('Finished');

	return 1;
}

try {
	main();
} catch (error) {
	console.error(error);
}
