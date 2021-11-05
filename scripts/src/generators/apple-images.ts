import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

import { getPath } from '../util/helper.js';
import { DEFAULTS, DEFAULT_APPLE_SPLASH_PATH } from '../util/consts.js';

import type { OutputInfo, Sharp } from 'sharp';

interface AppleImagesConfig {
	themeColor: Color;
	// iconsOutPath: DirPath;
	splashScreensOutPath: DirPath;
	themeColorDark?: Color;
}

export function generateAppleImages(icon: Sharp, padding: number, config: Partial<AppleImagesConfig>) {
	console.group('Apple Images');

	const tags = createImages(icon, padding, {
		themeColor: config.themeColor || DEFAULTS.themeColor,
		// iconsOutPath: config.iconsOutPath ||
		splashScreensOutPath: config.splashScreensOutPath || DEFAULT_APPLE_SPLASH_PATH,
		themeColorDark: config.themeColorDark,
	});

	console.groupEnd();
	return tags;
}

interface OrientationProps {
	size: string;
	width: number;
	height: number;
}

type GeneratorFn = (
	portrait: OrientationProps,
	landscape: OrientationProps,
	density: number
) => {
	metaTags: string[];
	outputinfo: Promise<OutputInfo>[];
};

async function createImages(icon: Sharp, padding: number, options: AppleImagesConfig) {
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

	const tags: string[] = [];
	const imagesPromises: Promise<OutputInfo>[] = [];

	let generator: GeneratorFn;

	const splashScreensOutPath = getPath(options.splashScreensOutPath);
	if (!existsSync(splashScreensOutPath)) {
		mkdirSync(splashScreensOutPath, { recursive: true });
	}

	if (!options.themeColorDark) {
		generator = (portrait: OrientationProps, landscape: OrientationProps, density: number) => {
			return createSplash({
				density,
				landscape,
				portrait,
				padding,
				image: icon,
				themeColor: options.themeColor,
				outPath: options.splashScreensOutPath,
			});
		};
	} else {
		generator = (portrait: OrientationProps, landscape: OrientationProps, density: number) => {
			return createSplashWithDark({
				density,
				landscape,
				portrait,
				padding,
				image: icon,
				themeColor: options.themeColor,
				themeColorDark: options.themeColorDark!,
				outPath: options.splashScreensOutPath,
			});
		};
	}

	try {
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

			const result = generator(portrait, landscape, density);
			tags.push(...result.metaTags);
			imagesPromises.push(...result.outputinfo);
		}

		await Promise.all(imagesPromises);
	} catch (error) {
		throw new Error('Error happened while creating Apple Splash-Screens' + error);
	}

	return tags;
}

function generateAppleIcons() {}

interface CreateSplashParams {
	image: Sharp;
	outPath: string;
	density: number;
	padding: number;
	themeColor: Color;
	portrait: OrientationProps;
	landscape: OrientationProps;
}

interface CreateSplashWithDarkParams extends CreateSplashParams {
	themeColorDark: Color;
}

function createSplashWithDark(config: CreateSplashWithDarkParams) {
	const { image, outPath, portrait, landscape, density, padding } = config;

	const portraitPath = `${outPath}/splash-portrait-${portrait.size}.png`;

	const portrtaitPromise = createPortraitSplashImage({
		image,
		padding,
		background: '#fff',
		width: portrait.width,
		height: portrait.height,
		path: portraitPath,
	});

	const portraitDarkPath = `${outPath}/splash-portrait-dark-${portrait.size}.png`;

	const portraitDarkPromise = createPortraitSplashImage({
		image,
		padding,
		background: '#fff',
		width: portrait.width,
		height: portrait.height,
		path: portraitDarkPath,
	});

	const landscapePath = `${outPath}/splash-landscape-${landscape.size}.png`;

	const landscapePromise = createLandscapeSplashImage({
		image,
		padding,
		background: '#fff',
		width: landscape.width,
		height: landscape.height,
		path: landscapePath,
	});

	const landscapeDarkPath = `${outPath}/splash-landscape-dark-${landscape.size}.png`;

	const landscapeDarkPromise = createLandscapeSplashImage({
		image,
		padding,
		background: '#fff',
		width: landscape.width,
		height: landscape.height,
		path: landscapeDarkPath,
	});

	return {
		metaTags: createMetaTagsWithDarkmode(portrait.width, portrait.height, density, {
			portrait: portraitPath,
			portraitDark: portraitDarkPath,
			landscape: landscapePath,
			landscapeDark: landscapeDarkPath,
		}),
		outputinfo: [portrtaitPromise, portraitDarkPromise, landscapePromise, landscapeDarkPromise],
	};
}

function createSplash({ image, outPath, portrait, landscape, density, padding }: CreateSplashParams) {
	const portraitPath = `${outPath}/splash-portrait-${portrait.size}.png`;

	const portrtaitPromise = createPortraitSplashImage({
		image,
		padding,
		background: '#fff',
		width: portrait.width,
		height: portrait.height,
		path: portraitPath,
	});

	const landscapePath = `${outPath}/splash-landscape-${landscape.size}.png`;

	const landscapePromise = createLandscapeSplashImage({
		image,
		padding,
		background: '#fff',
		width: landscape.width,
		height: landscape.height,
		path: landscapePath,
	});

	return {
		metaTags: createMetaTags(portrait.width, portrait.height, density, {
			portrait: portraitPath,
			landscape: landscapePath,
		}),
		outputinfo: [portrtaitPromise, landscapePromise],
	};
}

interface SplashImageProps {
	width: number;
	height: number;
	image: Sharp;
	padding: number;
	background: Color;
	path: string;
}

async function createPortraitSplashImage({ width, height, image, background, path, padding }: SplashImageProps) {
	const newImageSize = Math.ceil(width * (1 - padding));
	const top = Math.floor((height - newImageSize) / 2);
	const bottom = top;
	const left = Math.floor((width * padding) / 2);
	const right = left;

	return image
		.resize(newImageSize)
		.flatten({ background })
		.extend({
			background,
			bottom,
			top,
			left,
			right,
		})
		.toFile(getPath(path));
}

async function createLandscapeSplashImage({ width, height, image, background, path, padding }: SplashImageProps) {
	const newImageSize = Math.ceil(height * (1 - padding));
	const top = Math.floor((height * padding) / 2);
	const bottom = top;
	const left = Math.floor((width - newImageSize) / 2);
	const right = left;

	return image
		.resize(newImageSize)
		.flatten({ background })
		.extend({
			background,
			bottom,
			top,
			left,
			right,
		})
		.toFile(getPath(path));
}

// This one is slower than the 2 above because you have to wait
// for the image be resized and than converted to a buffer
async function createSplashImage({ width, height, image, background, path, padding }: SplashImageProps) {
	return sharp({
		create: {
			channels: 4,
			background: background,
			width: width,
			height: height,
		},
	})
		.composite([
			{
				input: await image.resize(Math.ceil(Math.min(width, height) * (1 - padding))).toBuffer(),
				gravity: 'center',
			},
		])
		.toFile(getPath(path));
}

function createMetaTags(
	width: number,
	height: number,
	density: number,
	href: {
		portrait: string;
		landscape: string;
	}
) {
	const { landscape, portrait } = createMediaProperties(width, height, density);
	return [
		`<link rel="apple-touch-startup-image" media="${portrait}" href="${href}"/>`,
		`<link rel="apple-touch-startup-image" media="${landscape}"href="${href}"/>`,
	];
}

interface DarkmodeHref {
	portrait: string;
	portraitDark: string;
	landscape: string;
	landscapeDark: string;
}

function createMetaTagsWithDarkmode(width: number, height: number, density: number, href: DarkmodeHref) {
	const { landscape, portrait } = createMediaProperties(width, height, density);
	return [
		`<link rel="apple-touch-startup-image" media="${portrait}" href="${href.portrait}"/>`,
		`<link rel="apple-touch-startup-image" media="(prefers-color-scheme: dark) and ${portrait}" href="${href.portraitDark}"/>`,
		`<link rel="apple-touch-startup-image" media="${landscape}"href="${href.landscape}"/>`,
		`<link rel="apple-touch-startup-image" media="(prefers-color-scheme: dark) and ${landscape}"href="${href.landscapeDark}"/>`,
	];
}

function createMediaProperties(width: number, height: number, density: number) {
	const portrait = `(device-width: ${width / density}px) and (device-height: ${
		height / density
	}px) and (-webkit-device-pixel-ratio: ${density}) and (orientation: portrait)`;
	const landscape = `(device-width: ${width / density}px) and (device-height: ${
		height / density
	}px) and (-webkit-device-pixel-ratio: ${density}) and (orientation: landscape)`;

	return {
		landscape,
		portrait,
	};
}
